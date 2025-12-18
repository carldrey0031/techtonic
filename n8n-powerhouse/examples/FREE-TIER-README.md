# X Profile Analyzer - FREE TIER Optimized

**Optimized for X API Free Tier (100 posts/month limit)**

---

## 📊 Free Tier Limits

Your Free tier includes:
- ✅ **100 posts retrieval per month**
- ✅ **500 writes per month**
- 🔄 Resets monthly

---

## ⚙️ Optimizations Applied

This version reduces API usage from **~150 posts** to **~25-30 posts per run**:

| Change | Original | Optimized | Savings |
|--------|----------|-----------|---------|
| Tweet Analysis | 100 tweets | **20 tweets** | -80 posts |
| Number of Searches | 3-4 searches | **1 search** | -40-60 posts |
| Results per Search | 20 results | **10 results** | -10-30 posts |
| **Total per Run** | ~150 posts | **~25-30 posts** | **-120 posts** ✅ |

---

## 🎯 What You Get

With these optimizations, you can:
- ✅ **Run workflow 3 times per month** (25-30 posts × 3 = 75-90 posts)
- ✅ Get profile analysis of your writing style
- ✅ Analyze 20 of your recent tweets (sufficient for style detection)
- ✅ Get 10 curated tweet suggestions per run
- ✅ Stay within Free tier limits

---

## 🚀 Quick Start

### 1. Import Workflow
```
File: x-profile-analyzer-FREE-TIER.json
```

### 2. Set Your Username

Edit **Configuration** node:
```json
{
  "xUsername": "carlodreyer",  // Your handle (no @)
  "tweetLimit": 20,            // Analyzes 20 tweets
  "trendingSearchLimit": 10     // Gets 10 results
}
```

### 3. Configure Credentials

- **X/Twitter OAuth2 API** (3 nodes)
- **Anthropic API** (2 AI nodes) - Uses Claude, not X API quota
- **Slack OAuth2 API** (1 node)

### 4. Run Strategically

**Recommended schedule:**
- Run **once per week** (4 times/month)
- Or **bi-weekly** (2 times/month with buffer)
- Save quota for when you need it most

---

## 📈 Usage Tracking

After each run, check your usage:
- Go to: https://developer.x.com/en/portal/dashboard
- View: **Monthly Post Cap Usage**
- Expected: +25-30 posts per workflow run

**Example:**
- Start: 42 posts used
- After 1 run: ~67 posts used (25 posts added)
- After 2 runs: ~92 posts used
- Remaining: ~8 posts (buffer for testing)

---

## 🎨 What's Different from Full Version?

| Feature | Full Version | Free Tier |
|---------|--------------|-----------|
| Tweets Analyzed | 100 | 20 |
| Search Queries | 3-4 | 1 |
| Results per Search | 20 | 10 |
| Total Suggestions | 10 | 10 (same!) |
| AI Quality | Same | Same |
| Style Matching | Same | Same |

**Bottom line:** You get the same quality suggestions, just with fewer candidate tweets to choose from.

---

## 💡 Pro Tips

### Maximize Your 3 Monthly Runs

**Week 1:** Run workflow
- Get 10 suggestions
- Engage with all 10 throughout the week

**Week 2:** Skip (use Week 1 suggestions)

**Week 3:** Run workflow again
- Fresh 10 suggestions
- New trending topics

**Week 4:** Skip or run (depends on quota)

### Quality Over Quantity

- 20 tweets is enough to analyze your style
- 10 suggestions is plenty for a week
- AI still generates personalized responses

### Monitor Your Quota

Set a reminder to check:
- Weekly: Review remaining quota
- Before runs: Ensure you have 30+ posts available
- After runs: Verify usage increase

---

## 🔄 When to Upgrade to Basic?

Consider upgrading ($100/month) if:
- ✅ You want to run **daily** instead of weekly
- ✅ Twitter is crucial for your business
- ✅ You need to analyze more tweets (100 vs 20)
- ✅ You want more search results (multiple queries)
- ✅ You're consistently hitting the 100/month limit

**ROI Calculation:**
- Cost: $100/month
- Time saved: 5-10 hours/month finding tweets
- If your hourly rate > $10-20, it pays for itself

---

## 🐛 Troubleshooting

### "Still getting 429 errors"

You might have exceeded your monthly quota. Check:
```
Dashboard → Monthly Post Cap Usage
If > 90 posts: Wait for monthly reset
```

### "Not enough suggestions"

With only 10 trending tweets:
- AI still selects best matches for your profile
- Quality > Quantity
- 10 curated suggestions better than 50 random ones

### "Profile analysis seems basic"

20 tweets is sufficient for:
- ✅ Detecting writing style
- ✅ Identifying emoji usage
- ✅ Understanding tone
- ✅ Finding expertise areas

100 tweets provides more data but 20 gives 80% of the insight.

---

## 📊 Expected Results

**Per Workflow Run:**

```
1. Your Profile Analysis ✅
   - Personality type
   - Humor style
   - Expertise areas (from 20 tweets)
   - Writing style (tone, emojis, punctuation)

2. Search Results ✅
   - 1 search with your top keywords
   - 10 trending tweets found
   - Ranked by relevance + engagement

3. AI Suggestions ✅
   - 10 personalized responses
   - Matched to your style
   - With relevance scores
   - Strategy recommendations

4. Slack Delivery ✅
   - Formatted message with all suggestions
   - Ready to copy-paste responses
```

---

## 🎯 Success Metrics

Track these to measure value:

1. **Suggestions Used:** Aim for 5-7 out of 10 (50-70%)
2. **Engagement Gained:** Track replies, likes from suggestions
3. **Time Saved:** vs. manually finding tweets (1-2 hours)
4. **Quota Efficiency:** Stay under 100 posts/month

---

## 🆙 Upgrade Path

When you outgrow Free tier:

**Basic Tier ($100/month):**
- 10,000 posts/month
- Run daily with full settings
- Multiple searches
- Analyze 100 tweets

**To upgrade:**
1. Go to: https://developer.x.com/en/portal/dashboard
2. Select: Upgrade to Basic
3. Update workflow: Use original settings (100 tweets, 3-4 searches)

---

## 📝 Change Log

**Optimizations Applied:**
- ✅ Reduced tweetLimit: 100 → 20
- ✅ Reduced trendingSearchLimit: 50 → 10
- ✅ Modified "Build Search Queries": 3-4 queries → 1 query
- ✅ Reduced max_results per search: 20 → 10
- ✅ Added "Continue On Fail" recommendations
- ✅ Optimized for monthly quota management

---

**Perfect for:** Individuals, side projects, testing, learning
**Not suitable for:** Agencies, high-volume users, daily engagement

---

## 🎉 You're Ready!

This FREE TIER version lets you:
- ✅ Get AI-powered tweet suggestions
- ✅ Stay within X API limits
- ✅ Run 3 times per month
- ✅ Save money while testing

**Import and run your first workflow now!** 🚀
