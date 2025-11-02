import httpx
import os
from bs4 import BeautifulSoup
from supabase import Client
from datetime import datetime
import asyncio
import anyio


async def get_teams_data():
    """Scrape NBA teams from Basketball-Reference"""
    async with httpx.AsyncClient() as client:
        url = "https://www.basketball-reference.com/teams/"
        response = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")
        teams = []
        table = soup.find("table", {"id": "teams_active"})

        if not table:
            return teams

        for row in table.find_all("tr")[1:]:
            th = row.find("th")
            if not th:
                continue

            a = th.find("a")
            if not a:
                continue

            abbreviation = a["href"].split("/")[-2]
            full_name = a.text.strip()
            parts = full_name.split()

            teams.append({
                "abbreviation": abbreviation.upper(),
                "full_name": full_name,
                "name": parts[-1] if parts else "",
                "city": " ".join(parts[:-1]) if len(parts) > 1 else "",
            })

        return teams


async def save_teams(supabase: Client, teams: list):
    """Save teams to Supabase"""
    if not teams:
        return

    for team in teams:
        try:
            await anyio.to_thread.run_sync(
                lambda t=team: supabase.table("teams").upsert(
                    [t], on_conflict="abbreviation"
                ).execute()
            )
        except Exception as e:
            print(f"Error saving team {team.get('abbreviation')}: {e}")


async def get_nba_odds():
    """Fetch NBA odds from The Odds API"""
    api_key = os.getenv("ODDS_API_KEY", "345c1ad37d7b391ec285a93579e7fe80")

    async with httpx.AsyncClient() as client:
        url = "https://api.the-odds-api.com/v4/sports/basketball_nba/events"
        params = {
            "apiKey": api_key,
            "regions": "us",
            "markets": "h2h,spread,totals"
        }

        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()


async def process_odds_data(supabase: Client, odds_data: dict):
    """Process and save odds data to Supabase"""
    events = odds_data.get("events", [])

    for event in events:
        try:
            game_id = event.get("id")
            home_team = event.get("home_team")
            away_team = event.get("away_team")
            commence_time = event.get("commence_time")

            game_data = {
                "id": game_id,
                "sport_key": event.get("sport_key"),
                "sport_title": event.get("sport_title"),
                "commence_time": commence_time,
                "home_team": home_team,
                "away_team": away_team,
            }

            await anyio.to_thread.run_sync(
                lambda g=game_data: supabase.table("games").upsert(
                    [g], on_conflict="id"
                ).execute()
            )

            bookmakers = event.get("bookmakers", [])
            for bookmaker in bookmakers:
                odds_records = []
                bookmaker_key = bookmaker.get("key")
                bookmaker_title = bookmaker.get("title")
                last_update = bookmaker.get("last_update")

                for market in bookmaker.get("markets", []):
                    market_key = market.get("key")
                    outcomes = market.get("outcomes", [])

                    if market_key == "h2h":
                        for outcome in outcomes:
                            odds_records.append({
                                "game_id": game_id,
                                "bookmaker_key": bookmaker_key,
                                "bookmaker_title": bookmaker_title,
                                "last_update": last_update,
                                "market_type": "h2h",
                                "team": outcome.get("name"),
                                "price": outcome.get("price"),
                            })

                    elif market_key == "spread":
                        for outcome in outcomes:
                            odds_records.append({
                                "game_id": game_id,
                                "bookmaker_key": bookmaker_key,
                                "bookmaker_title": bookmaker_title,
                                "last_update": last_update,
                                "market_type": "spread",
                                "team": outcome.get("name"),
                                "point": outcome.get("point"),
                                "price": outcome.get("price"),
                            })

                    elif market_key == "totals":
                        for outcome in outcomes:
                            odds_records.append({
                                "game_id": game_id,
                                "bookmaker_key": bookmaker_key,
                                "bookmaker_title": bookmaker_title,
                                "last_update": last_update,
                                "market_type": "totals",
                                "outcome_name": outcome.get("name"),
                                "point": outcome.get("point"),
                                "price": outcome.get("price"),
                            })

                if odds_records:
                    for record in odds_records:
                        try:
                            await anyio.to_thread.run_sync(
                                lambda r=record: supabase.table("odds").upsert(
                                    [r], on_conflict="id"
                                ).execute()
                            )
                        except Exception as e:
                            print(f"Error saving odds record: {e}")

        except Exception as e:
            print(f"Error processing event {event.get('id')}: {e}")


async def scrape_all_data(supabase: Client):
    """Main function to scrape all data"""
    try:
        print(f"[{datetime.now().isoformat()}] Starting scrape...")

        teams = await get_teams_data()
        print(f"Fetched {len(teams)} teams")
        await save_teams(supabase, teams)

        odds_data = await get_nba_odds()
        print(f"Fetched odds for {len(odds_data.get('events', []))} games")
        await process_odds_data(supabase, odds_data)

        print(f"[{datetime.now().isoformat()}] Scrape completed successfully")
    except Exception as e:
        print(f"Error during scrape: {e}")
