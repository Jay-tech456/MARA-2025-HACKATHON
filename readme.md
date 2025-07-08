# MARA Inaugural Hackathon 2025 Project: ASIC Rental Advisor Agent

## Overview

**ASIC Rental Advisor Agent** is an AI-powered tool designed for the 2025 MARA Inaugural Hackathon, enabling users to **evaluate, compare, and select optimal Bitcoin ASIC miner rentals**. The agent leverages real-time ASIC specifications, pricing, and power metrics to recommend the best mining hardware for any given budget, target hashrate, and runtime. It supports both manual rental of mining capacity and purchase of configured ASICs, empowering users to participate in Bitcoin mining pools or own their mining hardware outright.

## Key Features

- **Automated ASIC Evaluation:** Ranks available ASIC models by cost efficiency (rental price vs. expected BTC revenue).
- **Hashrate & Power Analysis:** Compares hashrate efficiency (TH/s per joule) and power cost impact for each model.
- **Personalized Recommendations:** Suggests the best rental option based on user-defined budget, target hashrate, and rental duration.
- **Trade-off Analysis:** Highlights trade-offs such as higher upfront rental cost vs. lower power draw.
- **Tagging System:** Assigns descriptive tags to each ASIC (e.g., "High-Efficiency", "Budget-Friendly", "Mining Optimized").
- **Pool Integration:** Recommends optimal mining pools with details on fees and features.
- **Strict Validation:** Ensures only relevant ASIC rental queries are processed.

## How It Works

1. **Input:** User provides a JSON with budget, target hashrate, and runtime.
2. **Processing:** The agent internally:
   - Gathers candidate ASIC models.
   - Calculates cost-per-TH/s and joules-per-TH.
   - Compares ROI, energy costs, and reliability.
   - Ranks and selects the top 3 models.
3. **Output:** Returns a structured JSON with:
   - Top 3 ASIC model recommendations.
   - Key metrics (cost, efficiency, estimated profit, tags).
   - Recommended pool and features.
   - Summary of trade-offs for each model.

*No intermediate steps, explanations, or process details are exposed to the user—only the final JSON result is returned.*

## Example Output

```json
{
    "top_3_asic_models": [
        "Antminer S21 Pro",
        "Whatsminer M53S++",
        "Antminer S21 XP"
    ],
    "key_metrics": {
        "Antminer S21 Pro": {
            "cost_per_TH": 1.25,
            "joules_per_TH": 15,
            "estimated_daily_profit": 0.00056,
            "tags": ["High-Efficiency", "Budget-Friendly"],
            "recommended_pool": "Antpool",
            "pool_fee": 1.5,
            "pool_features": ["PPS+", "Low Latency", "24/7 Support"]
        },
        "Whatsminer M53S++": {
            "cost_per_TH": 1.36,
            "joules_per_TH": 16,
            "estimated_daily_profit": 0.00055,
            "tags": ["Energy Efficient", "Premium"],
            "recommended_pool": "F2Pool",
            "pool_fee": 2.0,
            "pool_features": ["FPPS", "High Reliability", "Global Servers"]
        },
        "Antminer S21 XP": {
            "cost_per_TH": 1.40,
            "joules_per_TH": 13.5,
            "estimated_daily_profit": 0.00052,
            "tags": ["Mining Optimized", "Ultra High Speed"],
            "recommended_pool": "ViaBTC",
            "pool_fee": 1.8,
            "pool_features": ["PPLNS", "Stable Payouts", "Advanced Dashboard"]
        }
    },
    "recommended_rental_duration": "30 days",
    "budget_envelope": "$200/day",
    "summary_of_trade_offs": {
        "Antminer S21 Pro": "Lowest cost per TH, excellent efficiency, but may have longer ROI if BTC price drops.",
        "Whatsminer M53S++": "Slightly higher cost but premium build and reliability; suitable for stable power environments.",
        "Antminer S21 XP": "Fastest hashrate and best energy savings, but highest upfront rental cost."
    }
}
```

## Usage

- **Input Requirements:** JSON with at least a "budget" field.
- **Validation:** If "budget" is missing or input is off-topic, the agent responds with a JSON error message.
- **Deployment:** The agent is monetized and available for client use, supporting both rental and purchase workflows.

## Hackathon Context

This project was developed for the **MARA Inaugural Hackathon 2025** in San Francisco, focused on the intersection of **energy, AI, and Bitcoin mining**. The event challenged participants to build AI-driven systems for optimizing compute and energy resources, with a strong emphasis on real-world applicability and user empowerment[6].

*For further details or integration support, please contact the project team or refer to the agent’s API documentation.*

[1] https://ezblockchain.net/article/can-you-make-a-profit-with-asic-mining/
[2] https://www.kucoin.com/learn/crypto/how-to-mine-bitcoin
[3] https://www.linkedin.com/pulse/hidden-economics-bitcoin-mining-2025-costs-challenges-dora-qin-symfe
[4] https://learnmeabitcoin.com/technical/mining/
[5] https://asicmarketplace.com/blog/bitcoin-mining-profitable/
[6] https://www.mara.com/posts/1-bitcoin-100-builders-highlights-from-maras-first-hackathon
[7] https://bitbo.io/how-many-bitcoin/
[8] https://www.hackerearth.com/community-hackathons/resources/e-books/guide-to-organize-hackathon/
[9] https://ecos.am/en/blog/is-asic-mining-profitable-in-2025-factors-tips-and-future-trends/
[10] https://github.com/mkearney/data-scribers/blob/master/docs/index.xml
