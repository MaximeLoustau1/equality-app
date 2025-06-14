from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "equality_dashboard.sqlite"

@app.get("/average-by-industry")
def get_average_by_industry():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT company_scores."Sector", ROUND(AVG(CAST("Total weighted" AS FLOAT)), 2) as avg_score
        FROM company_scores
        JOIN company_data USING(Name)
        GROUP BY company_scores."Sector"
        ORDER BY avg_score DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return [{"industry": row[0], "avg_score": row[1]} for row in rows if row[0]]


@app.get("/average-by-country")
def get_average_by_country():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT company_scores."Country Evaluation", ROUND(AVG(CAST("Total weighted" AS FLOAT)), 2) as avg_score
        FROM company_scores
        JOIN company_data USING(Name)
        GROUP BY company_scores."Country Evaluation"
        ORDER BY avg_score DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return [{"country": row[0], "avg_score": row[1]} for row in rows if row[0]]


@app.get("/summary")
def get_summary():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute('SELECT AVG(CAST("Total weighted" AS FLOAT)) FROM company_scores')
    avg_score = round(cur.fetchone()[0], 2)

    cur.execute("""
        SELECT company_scores."Country Evaluation", 
               ROUND(AVG(CAST("Total weighted" AS FLOAT)), 2) AS avg_score
        FROM company_scores
        JOIN company_data USING(Name)
        GROUP BY company_scores."Country Evaluation"
        ORDER BY avg_score DESC
        LIMIT 1
    """)
    top_region = cur.fetchone()
    top_region_str = f"{top_region[0]} (Avg. {top_region[1]})"

    cur.execute("""
        SELECT company_scores."Sector", 
               ROUND(AVG(CAST("Total weighted" AS FLOAT)), 2) AS avg_score
        FROM company_scores
        JOIN company_data USING(Name)
        GROUP BY company_scores."Sector"
        ORDER BY avg_score DESC
        LIMIT 1
    """)
    top_industry = cur.fetchone()
    top_industry_str = f"{top_industry[0]} (Avg. {top_industry[1]})"

    conn.close()

    return {
        "averageScore": f"{avg_score} / 100",
        "topRegion": top_region_str,
        "topIndustry": top_industry_str
    }


@app.get("/countries")
def get_country_data():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        SELECT company_scores."Country", 
               company_scores."Sector", 
               company_scores."Group", 
               company_scores."Total weighted",
                company_data."A4. Workforce"
                
        FROM company_scores
        JOIN company_data USING(Name)
    """)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    conn.close()

    result = []
    for row in rows:
        record = dict(zip(columns, row))
        raw_score = record.pop("Total weighted")
        female_pct = record.pop("A4. Workforce")
        try:
            record["Total Score"] = float(raw_score)
            record["Female %"] = float(female_pct)
            result.append(record)
        except (ValueError, TypeError):
            continue  # Skip rows with invalid score

    return result



@app.get("/countries-average-score")
def get_country_average_scores():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        SELECT company_scores."Country", 
               ROUND(AVG(CAST("Total weighted" AS FLOAT)), 2) AS score
        FROM company_scores
        JOIN company_data USING(Name)
        GROUP BY company_scores."Country"
    """)
    rows = cur.fetchall()
    conn.close()

    return [{"country": row[0].strip(), "score": row[1]} for row in rows if row[0]]

