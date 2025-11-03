import os
import asyncio
import contextlib
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import anyio
# Import supabase through isolated client to avoid conflicts
from supabase_client import create_isolated_supabase_client, get_supabase_config
from typing import Any as Client  # Use Any as Client placeholder to fix typing
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz

# Temporarily use mock implementations to avoid httpx_socks conflicts with supabase
# These will be loaded dynamically when needed
def scrape_all_data(*args, **kwargs):
    """Mock scraper function - will be replaced with real implementation"""
    logger.info("Using mock scraper - anti-bot functionality disabled for now")
    return {}

class NBAReportGenerator:
    """Mock report generator - will be replaced with real implementation"""
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        logger.info("Using mock report generator")
    
    async def generate_750am_report(self):
        return {"report_type": "750am_mock", "timestamp": datetime.now().isoformat()}
    
    async def generate_800am_report(self):
        return {"report_type": "800am_mock", "timestamp": datetime.now().isoformat()}
    
    async def generate_1100am_report(self):
        return {"report_type": "1100am_mock", "timestamp": datetime.now().isoformat()}
    
    async def _bulls_gameday_analysis(self):
        return {"mock": "bulls_analysis"}
    
    async def _comprehensive_betting_strategy(self):
        return {"mock": "betting_strategy"}
    
    def calculate_kelly_criterion(self, prob, odds):
        return max(0, min((prob * odds - 1) / (odds - 1) * 0.25, 0.25))
    
    def format_betting_slip(self, bets, stake):
        return {"mock": "betting_slip", "total_stake": stake}
    
    async def save_report(self, report, report_type):
        """Mock save report"""
        logger.info(f"Mock saving report: {report_type}")
        return True
        
        def calculate_roi_projection(self, history):
            return {"roi": 0, "total_bets": 0, "win_rate": 0}
        
        async def identify_arbitrage_opportunities(self, odds):
            return []

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
SCRAPE_INTERVAL_SECONDS = 6 * 60 * 60
CHICAGO_TZ = pytz.timezone("America/Chicago")


async def scrape_loop(supabase: Client, stop_evt: asyncio.Event):
    """Background loop to scrape data at regular intervals"""
    try:
        while not stop_evt.is_set():
            await scrape_all_data(supabase)
            try:
                await asyncio.wait_for(stop_evt.wait(), timeout=SCRAPE_INTERVAL_SECONDS)
            except asyncio.TimeoutError:
                pass
    except asyncio.CancelledError:
        print("Scrape loop cancelled")
        raise


async def generate_750am_report(supabase: Client):
    """Generate 7:50 AM report"""
    try:
        print(f"[{datetime.now().isoformat()}] Generating 7:50 AM report...")
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_750am_report()
        await generator.save_report(report, "750am_previous_day")
        print(f"[{datetime.now().isoformat()}] 7:50 AM report completed")
    except Exception as e:
        print(f"Error generating 7:50 AM report: {e}")


async def generate_800am_report(supabase: Client):
    """Generate 8:00 AM report"""
    try:
        print(f"[{datetime.now().isoformat()}] Generating 8:00 AM report...")
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_800am_report()
        await generator.save_report(report, "800am_morning")
        print(f"[{datetime.now().isoformat()}] 8:00 AM report completed")
    except Exception as e:
        print(f"Error generating 8:00 AM report: {e}")


async def generate_1100am_report(supabase: Client):
    """Generate 11:00 AM report"""
    try:
        print(f"[{datetime.now().isoformat()}] Generating 11:00 AM report...")
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_1100am_report()
        await generator.save_report(report, "1100am_gameday")
        print(f"[{datetime.now().isoformat()}] 11:00 AM report completed")
    except Exception as e:
        print(f"Error generating 11:00 AM report: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app lifecycle - startup and shutdown"""
    # Initialize Supabase client first  
    try:
        config = get_supabase_config()
        
        if not config["available"]:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
            
        # Use SERVICE_ROLE_KEY for backend operations (has elevated privileges)
        service_key = config["service_key"] or config["anon_key"]
        supabase = create_isolated_supabase_client(config["url"], service_key)
        app.state.supabase = supabase
        
        if config["service_key"]:
            print("✅ Starting application with Supabase (Service Role)")
        else:
            print("⚠️ Starting application with Supabase (Anon Key - limited permissions)")
        
        # Import scrapers after Supabase client is created to avoid conflicts
        try:
            from scrapers import scrape_all_data as real_scrape_all_data
            from reports import NBAReportGenerator as RealNBAReportGenerator
            
            # Replace mock functions with real implementations
            global scrape_all_data, NBAReportGenerator
            scrape_all_data = real_scrape_all_data
            NBAReportGenerator = RealNBAReportGenerator
            print("✅ Anti-bot scraping system loaded")
            
        except ImportError as ie:
            print(f"⚠️ Scrapers not available: {ie}")
        
        # Start data scraping on startup (only if enabled)
        if os.getenv("AUTO_SCRAPE_ON_START", "false").lower() == "true":
            await scrape_all_data(supabase)
        else:
            print("Automatic scraping on startup disabled. Use /api/scrape endpoints to trigger manually.")
            
    except Exception as e:
        print(f"❌ Error initializing Supabase: {e}")
        print("Running in development mode without Supabase...")
        app.state.supabase = None

    # Set up scheduler for reports if scheduling is enabled (even without Supabase in dev mode)
    scheduler_enabled = os.getenv("ENABLE_SCHEDULER", "false").lower() == "true"
    
    if scheduler_enabled:
        scheduler = AsyncIOScheduler(timezone=CHICAGO_TZ)

        scheduler.add_job(
            generate_750am_report,
            CronTrigger(hour=7, minute=50, timezone=CHICAGO_TZ),
            args=[app.state.supabase],
            id="report_750am"
        )

        scheduler.add_job(
            generate_800am_report,
            CronTrigger(hour=8, minute=0, timezone=CHICAGO_TZ),
            args=[app.state.supabase],
            id="report_800am"
        )

        scheduler.add_job(
            generate_1100am_report,
            CronTrigger(hour=11, minute=0, timezone=CHICAGO_TZ),
            args=[app.state.supabase],
            id="report_1100am"
        )

        scheduler.start()
        print("✅ Scheduler enabled and running")

        if app.state.supabase:
            app.state.stop_evt = asyncio.Event()
            task = asyncio.create_task(scrape_loop(app.state.supabase, app.state.stop_evt))
            print("✅ Background scraping task started")
        else:
            print("⚠️ Background scraping disabled - no Supabase connection")
            task = None
    else:
        print("❌ Scheduler disabled - set ENABLE_SCHEDULER=true to enable")
        scheduler = None
        task = None

    try:
        yield
    finally:
        print("Shutting down application...")
        if hasattr(app.state, 'stop_evt') and app.state.stop_evt:
            app.state.stop_evt.set()
        if task:
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await task
        if scheduler:
            scheduler.shutdown(wait=False)


app = FastAPI(title="NBA Analysis API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/teams")
async def get_teams():
    """Get all teams"""
    try:
        supabase = app.state.supabase
        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("teams").select("*").execute()
        )
        return {"teams": response.data}
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/games/today")
async def get_today_games():
    """Get today's games"""
    try:
        supabase = app.state.supabase
        today = datetime.now().date()
        tomorrow = today + timedelta(days=1)

        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("games")
            .select("*")
            .gte("commence_time", today.isoformat())
            .lt("commence_time", tomorrow.isoformat())
            .execute()
        )
        return {"games": response.data}
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/odds/{game_id}")
async def get_game_odds(game_id: str):
    """Get odds for a specific game"""
    try:
        supabase = app.state.supabase
        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("odds").select("*").eq("game_id", game_id).execute()
        )
        return {"odds": response.data}
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/players")
async def get_all_players(team: str = None, position: str = None, active: bool = True):
    """Get all players with optional filters"""
    try:
        supabase = app.state.supabase
        
        query = supabase.table("players").select("""
            *,
            teams!players_team_id_fkey (
                abbreviation,
                full_name,
                city,
                name
            )
        """)
        
        if team:
            query = query.eq("team_abbreviation", team.upper())
        if position:
            query = query.ilike("position", f"%{position}%")
        if active is not None:
            query = query.eq("is_active", active)
            
        # Order by team, then by jersey number
        query = query.order("team_abbreviation").order("jersey_number")
        
        response = await anyio.to_thread.run_sync(lambda: query.execute())
        return {"players": response.data, "count": len(response.data)}
    except Exception as e:
        logger.error(f"Error fetching players: {e}")
        return {"error": str(e)}, 500


@app.get("/api/teams/{team_abbrev}/players")
async def get_team_players(team_abbrev: str):
    """Get all players for a specific team"""
    try:
        supabase = app.state.supabase
        
        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("players")
            .select("""
                *,
                teams!players_team_id_fkey (
                    abbreviation,
                    full_name,
                    city,
                    name
                )
            """)
            .eq("team_abbreviation", team_abbrev.upper())
            .eq("is_active", True)
            .order("jersey_number")
            .execute()
        )
        
        if not response.data:
            # Check if team exists
            team_check = await anyio.to_thread.run_sync(
                lambda: supabase.table("teams")
                .select("abbreviation")
                .eq("abbreviation", team_abbrev.upper())
                .execute()
            )
            
            if not team_check.data:
                raise HTTPException(status_code=404, detail=f"Team '{team_abbrev}' not found")
            else:
                return {"players": [], "count": 0, "message": f"No active players found for {team_abbrev}"}
        
        return {
            "team": team_abbrev.upper(),
            "players": response.data, 
            "count": len(response.data)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching team players: {e}")
        return {"error": str(e)}, 500


@app.get("/api/players/{player_id}")
async def get_player_details(player_id: str):
    """Get detailed information for a specific player"""
    try:
        supabase = app.state.supabase
        
        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("players")
            .select("""
                *,
                teams!players_team_id_fkey (
                    abbreviation,
                    full_name,
                    city,
                    name
                )
            """)
            .eq("id", player_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Player with ID '{player_id}' not found")
            
        return {"player": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching player details: {e}")
        return {"error": str(e)}, 500


@app.get("/api/players/search/{name}")
async def search_players_by_name(name: str):
    """Search players by name"""
    try:
        supabase = app.state.supabase
        
        response = await anyio.to_thread.run_sync(
            lambda: supabase.table("players")
            .select("""
                *,
                teams!players_team_id_fkey (
                    abbreviation,
                    full_name,
                    city,
                    name
                )
            """)
            .ilike("name", f"%{name}%")
            .eq("is_active", True)
            .order("name")
            .execute()
        )
        
        return {
            "query": name,
            "players": response.data, 
            "count": len(response.data)
        }
    except Exception as e:
        logger.error(f"Error searching players: {e}")
        return {"error": str(e)}, 500


@app.post("/api/scrape/rosters")
async def trigger_roster_scrape(season: str = "2025"):
    """Manually trigger roster scraping for all teams"""
    try:
        from scrapers import scrape_all_team_rosters
        
        supabase = app.state.supabase
        
        # Run roster scraping in background
        asyncio.create_task(scrape_all_team_rosters(supabase, season))
        
        return {
            "message": f"Roster scraping initiated for season {season}",
            "timestamp": datetime.now().isoformat(),
            "status": "in_progress"
        }
    except Exception as e:
        logger.error(f"Error triggering roster scrape: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger roster scraping")


@app.get("/api/status")
async def get_status():
    """Get application status"""
    return {
        "status": "running",
        "scrape_interval_hours": SCRAPE_INTERVAL_SECONDS / 3600,
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/reports/750am")
async def get_750am_report():
    """Get 7:50 AM report (previous day analysis)"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_750am_report()
        return report
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/reports/800am")
async def get_800am_report():
    """Get 8:00 AM report (morning summary)"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_800am_report()
        return report
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/reports/1100am")
async def get_1100am_report():
    """Get 11:00 AM report (game-day scouting)"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        report = await generator.generate_1100am_report()
        return report
    except Exception as e:
        return {"error": str(e)}, 500


@app.get("/api/bulls-analysis")
async def get_bulls_analysis():
    """Get Bulls-focused analysis and recommendations"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        analysis = await generator._bulls_gameday_analysis()
        return analysis
    except Exception as e:
        logger.error(f"Error generating Bulls analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate Bulls analysis")


@app.post("/api/scrape/bulls-players")
async def scrape_bulls_players_endpoint():
    """Manually trigger Bulls players scraping with anti-bot protection"""
    try:
        from scrapers import get_bulls_players_data, save_bulls_players
        
        logger.info("Manual Bulls players scraping triggered")
        supabase = app.state.supabase
        
        # Scrape Bulls players using advanced anti-bot protection
        players = await get_bulls_players_data()
        
        if players:
            await save_bulls_players(supabase, players)
            logger.info(f"Successfully scraped and saved {len(players)} Bulls players")
            return {
                "success": True,
                "message": f"Successfully scraped {len(players)} Bulls players",
                "players_count": len(players),
                "timestamp": datetime.now().isoformat()
            }
        else:
            logger.warning("No Bulls players scraped")
            return {
                "success": False,
                "message": "No Bulls players found or scraping failed",
                "players_count": 0,
                "timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Error scraping Bulls players: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to scrape Bulls players: {str(e)}")


@app.get("/api/betting-recommendations")
async def get_betting_recommendations():
    """Get current betting recommendations"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        recommendations = await generator._comprehensive_betting_strategy()
        return recommendations
    except Exception as e:
        logger.error(f"Error generating betting recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate betting recommendations")


@app.get("/api/arbitrage-opportunities")
async def get_arbitrage_opportunities():
    """Find arbitrage betting opportunities"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        # Mock odds data - replace with real API integration
        odds_data = []
        opportunities = await generator.identify_arbitrage_opportunities(odds_data)
        return {"opportunities": opportunities, "count": len(opportunities)}
    except Exception as e:
        logger.error(f"Error finding arbitrage opportunities: {e}")
        raise HTTPException(status_code=500, detail="Failed to find arbitrage opportunities")


@app.post("/api/betting-slip")
async def generate_betting_slip(bets: List[dict], total_stake: float = 100):
    """Generate professional betting slip with Kelly criterion sizing"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        formatted_slip = generator.format_betting_slip(bets, total_stake)
        return formatted_slip
    except Exception as e:
        logger.error(f"Error generating betting slip: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate betting slip")


@app.get("/api/kelly-calculator")
async def calculate_kelly(estimated_prob: float, decimal_odds: float):
    """Calculate Kelly Criterion bet sizing"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        kelly_fraction = generator.calculate_kelly_criterion(estimated_prob, decimal_odds)
        return {
            "kelly_fraction": kelly_fraction,
            "percentage": kelly_fraction * 100,
            "recommended_stake": f"{kelly_fraction * 100:.2f}% of bankroll"
        }
    except Exception as e:
        logger.error(f"Error calculating Kelly criterion: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate Kelly criterion")


@app.get("/api/performance-metrics")
async def get_performance_metrics():
    """Get betting performance and ROI metrics"""
    try:
        supabase = app.state.supabase
        generator = NBAReportGenerator(supabase)
        # Mock bet history - replace with real database
        bet_history = []
        metrics = generator.calculate_roi_projection(bet_history)
        return metrics
    except Exception as e:
        logger.error(f"Error calculating performance metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate performance metrics")


@app.get("/api/teams/analysis")
async def get_teams_analysis():
    """Get comprehensive analysis for all NBA teams"""
    try:
        supabase = app.state.supabase
        
        # Get all teams with basic info
        teams_response = await anyio.to_thread.run_sync(
            lambda: supabase.table("teams").select("*").order("abbreviation").execute()
        )
        
        # Generate mock analysis data for each team (in production, this would come from real data)
        teams_analysis = []
        conferences = {
            'Eastern': ['ATL', 'BOS', 'BKN', 'CHA', 'CHI', 'CLE', 'DET', 'IND', 'MIA', 'MIL', 'NYK', 'ORL', 'PHI', 'TOR', 'WAS'],
            'Western': ['DAL', 'DEN', 'GSW', 'HOU', 'LAC', 'LAL', 'MEM', 'MIN', 'NOP', 'OKC', 'PHX', 'POR', 'SAC', 'SAS', 'UTA']
        }
        
        divisions = {
            'Atlantic': ['BOS', 'BKN', 'NYK', 'PHI', 'TOR'],
            'Central': ['CHI', 'CLE', 'DET', 'IND', 'MIL'],
            'Southeast': ['ATL', 'CHA', 'MIA', 'ORL', 'WAS'],
            'Northwest': ['DEN', 'MIN', 'OKC', 'POR', 'UTA'],
            'Pacific': ['GSW', 'LAC', 'LAL', 'PHX', 'SAC'],
            'Southwest': ['DAL', 'HOU', 'MEM', 'NOP', 'SAS']
        }
        
        for team in teams_response.data:
            abbr = team['abbreviation']
            
            # Determine conference and division
            conference = 'Eastern' if abbr in conferences['Eastern'] else 'Western'
            division = next((div for div, teams in divisions.items() if abbr in teams), 'Unknown')
            
            # Mock statistics (in production, fetch from games/odds tables)
            import random
            wins = random.randint(15, 45)
            losses = random.randint(15, 45)
            
            team_analysis = {
                **team,
                'conference': conference,
                'division': division,
                'season_stats': {
                    'wins': wins,
                    'losses': losses,
                    'win_percentage': round(wins / (wins + losses), 3),
                    'points_per_game': round(random.uniform(105, 125), 1),
                    'points_allowed': round(random.uniform(105, 125), 1),
                    'offensive_rating': round(random.uniform(105, 125), 1),
                    'defensive_rating': round(random.uniform(105, 125), 1),
                    'net_rating': round(random.uniform(-15, 15), 1)
                },
                'recent_form': {
                    'last_10': f"{random.randint(3, 8)}-{random.randint(2, 7)}",
                    'last_5': f"{random.randint(1, 5)}-{random.randint(0, 4)}",
                    'home_record': f"{random.randint(8, 25)}-{random.randint(5, 20)}",
                    'away_record': f"{random.randint(5, 20)}-{random.randint(10, 25)}",
                    'vs_conference': f"{random.randint(10, 25)}-{random.randint(10, 25)}"
                },
                'betting_stats': {
                    'ats_record': f"{random.randint(25, 35)}-{random.randint(20, 30)}",
                    'ats_percentage': round(random.uniform(0.45, 0.60), 3),
                    'over_under': f"{random.randint(25, 35)}-{random.randint(20, 30)}",
                    'ou_percentage': round(random.uniform(0.45, 0.60), 3),
                    'avg_total': round(random.uniform(210, 235), 1)
                },
                'key_players': [
                    f"Player {random.randint(1, 50)}",
                    f"Player {random.randint(1, 50)}",
                    f"Player {random.randint(1, 50)}"
                ],
                'strength_rating': random.randint(65, 95),
                'last_updated': datetime.now().isoformat()
            }
            
            teams_analysis.append(team_analysis)
        
        return {
            'teams': teams_analysis,
            'count': len(teams_analysis),
            'conferences': {
                'Eastern': [t for t in teams_analysis if t['conference'] == 'Eastern'],
                'Western': [t for t in teams_analysis if t['conference'] == 'Western']
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching teams analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch teams analysis")


@app.get("/api/teams/{team_abbrev}/analysis")
async def get_team_analysis(team_abbrev: str):
    """Get detailed analysis for a specific team"""
    try:
        supabase = app.state.supabase
        team_abbrev = team_abbrev.upper()
        
        # Get team basic info
        team_response = await anyio.to_thread.run_sync(
            lambda: supabase.table("teams")
            .select("*")
            .eq("abbreviation", team_abbrev)
            .single()
            .execute()
        )
        
        if not team_response.data:
            raise HTTPException(status_code=404, detail=f"Team '{team_abbrev}' not found")
        
        team = team_response.data
        
        # Generate comprehensive team analysis
        import random
        from datetime import datetime, timedelta
        
        # Mock recent games
        recent_games = []
        for i in range(5):
            game_date = datetime.now() - timedelta(days=(i+1)*3)
            opponent = random.choice(['LAL', 'BOS', 'GSW', 'MIA', 'PHX'])
            is_home = random.choice([True, False])
            team_score = random.randint(95, 130)
            opp_score = random.randint(95, 130)
            
            recent_games.append({
                'date': game_date.strftime('%Y-%m-%d'),
                'opponent': opponent,
                'home': is_home,
                'team_score': team_score,
                'opponent_score': opp_score,
                'result': 'W' if team_score > opp_score else 'L',
                'margin': abs(team_score - opp_score)
            })
        
        # Generate detailed analysis
        analysis = {
            **team,
            'season_record': {
                'wins': random.randint(20, 45),
                'losses': random.randint(15, 40),
                'win_percentage': round(random.uniform(0.35, 0.75), 3)
            },
            'advanced_stats': {
                'offensive_rating': round(random.uniform(105, 125), 1),
                'defensive_rating': round(random.uniform(105, 125), 1),
                'net_rating': round(random.uniform(-10, 15), 1),
                'pace': round(random.uniform(95, 105), 1),
                'effective_fg_percentage': round(random.uniform(0.50, 0.60), 3),
                'true_shooting_percentage': round(random.uniform(0.52, 0.62), 3)
            },
            'recent_games': recent_games,
            'form_analysis': {
                'last_10_games': f"{random.randint(4, 8)}-{random.randint(2, 6)}",
                'home_form': f"{random.randint(10, 20)}-{random.randint(5, 15)}",
                'away_form': f"{random.randint(8, 18)}-{random.randint(7, 17)}"
            },
            'betting_trends': {
                'ats_home': f"{random.randint(10, 20)}-{random.randint(8, 18)}",
                'ats_away': f"{random.randint(8, 18)}-{random.randint(10, 20)}",
                'over_under_home': f"{random.randint(12, 22)}-{random.randint(8, 18)}"
            },
            'last_updated': datetime.now().isoformat()
        }
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching team analysis for {team_abbrev}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch team analysis")


@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers and monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "nba-analytics-backend",
        "version": "1.0.0"
    }
