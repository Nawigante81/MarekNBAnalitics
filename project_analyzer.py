import os
import glob

def analyze_project_structure():
    base_path = '/workspaces/MarekNBAnalitics'
    
    structure = {
        'python_files': len(glob.glob(f'{base_path}/**/*.py', recursive=True)),
        'notebooks': len(glob.glob(f'{base_path}/**/*.ipynb', recursive=True)),
        'data_files': len(glob.glob(f'{base_path}/**/*.csv', recursive=True)),
        'config_files': len(glob.glob(f'{base_path}/**/*.json', recursive=True)),
    }
    
    print("📁 STRUKTURA PROJEKTU:")
    for key, value in structure.items():
        print(f"   {key}: {value}")
    
    # Sprawdź główne katalogi
    expected_dirs = ['data', 'src', 'tests', 'notebooks', 'scripts']
    existing_dirs = [d for d in expected_dirs if os.path.exists(f'{base_path}/{d}')]
    
    print(f"\n📂 ISTNIEJĄCE KATALOGI: {existing_dirs}")
    print(f"❓ BRAKUJĄCE KATALOGI: {set(expected_dirs) - set(existing_dirs)}")

if __name__ == "__main__":
    analyze_project_structure()