# X Profile Analyzer & Tweet Suggestion Engine

**Pattern:** AI Agent Workflow + Scheduled Tasks
**Complexity:** Advanced
**AI Model:** Claude 3.5 Sonnet (or GPT-4)
**Services:** X/Twitter API, OpenAI/Anthropic, Slack

---

## 🎯 What This Workflow Does

This is an AI-powered senior developer assistant that:

1. **Analyzes Your X Profile** - Checks your bio, follower stats, and engagement
2. **Studies Your Tweet History** - Analyzes last 100 tweets to understand your style
3. **Creates Your Profile** - AI determines:
   - Personality type (MBTI or descriptive)
   - Humor style (witty, sarcastic, wholesome, etc.)
   - Areas of expertise (specific topics/skills)
   - Writing style (tone, punctuation, emoji usage, common phrases)
4. **Finds Relevant Trending Tweets** - Searches X for trending content matching your profile
5. **Selects Top 10 Tweets** - AI ranks tweets by relevance and engagement potential
6. **Generates Pre-filled Responses** - AI writes replies in YOUR style:
   - Matches your tone and personality
   - Uses your typical punctuation
   - Includes emojis at your frequency
   - Reflects your humor style
   - Adds value based on your expertise

---

## 🏗️ Workflow Architecture

```
Daily 9 AM (or manual)
    ↓
Get X Profile (bio, stats, location)
    ↓
Get Last 100 Tweets (your originals only)
    ↓
AI Analysis: Create Profile
  - Personality type
  - Humor style
  - Expertise areas
  - Writing style analysis
  - Extract search keywords
    ↓
Build Search Queries (from profile keywords)
    ↓
Search Trending Tweets (3-4 searches)
    ↓
Aggregate & Rank (by engagement)
    ↓
AI Selection & Response Generation
  - Select top 10 most relevant
  - Generate responses in your style
  - Provide response strategy
    ↓
Format & Send to Slack
  - Tweet links
  - Pre-filled responses
  - Relevance scores
```

---

## ⚡ Key Features

### 1. **Deep Profile Analysis**
- Analyzes 100+ tweets for style patterns
- Detects emoji usage frequency
- Identifies common phrases and patterns
- Understands your tone and personality

### 2. **Smart Tweet Matching**
- Searches multiple keyword combinations
- Ranks by engagement AND relevance
- Filters for genuine engagement opportunities
- Avoids tweets outside your expertise

### 3. **Style-Matched Responses**
- Mirrors your sentence length
- Copies your punctuation style
- Uses emojis at your frequency
- Reflects your humor type
- Sounds authentically like YOU

### 4. **Engagement Intelligence**
- Scores each tweet by relevance (0-100)
- Explains WHY you should respond
- Suggests response strategy (agree/disagree/insight/question/humor)
- Prioritizes value-add opportunities

---

## 📋 Setup Instructions

### Prerequisites

1. **X/Twitter Developer Account**
   - Apply at https://developer.twitter.com
   - Get API keys (OAuth 2.0)
   - Requires "Read" and "Write" permissions

2. **AI API Key**
   - **Anthropic Claude API** (recommended): https://console.anthropic.com
   - OR **OpenAI GPT-4**: https://platform.openai.com
   - Claude 3.5 Sonnet recommended for best results

3. **Slack Workspace**
   - Channel for daily suggestions (e.g., `#twitter-suggestions`)
   - Slack bot with post permissions

---

### Step 1: Import Workflow

1. Download `x-profile-analyzer-workflow.json`
2. In n8n: **Workflows** → **Import from File**
3. Select the JSON file

---

### Step 2: Configure Credentials

#### X/Twitter API (OAuth 2.0)
```
1. Go to https://developer.twitter.com/en/portal/projects-and-apps
2. Create new app or use existing
3. Get Client ID and Client Secret
4. In n8n:
   - Credentials → New → Twitter OAuth2 API
   - Enter Client ID and Secret
   - Complete OAuth flow
5. Assign to nodes:
   - Get X User Profile
   - Get Recent Tweets
   - Search Trending Tweets
```

#### OpenAI/Anthropic API
```
1. Get API key from provider
2. In n8n:
   - Credentials → New → OpenAI API (or Anthropic)
   - Enter API key
3. Assign to nodes:
   - AI Profile Analysis
   - AI Generate Suggestions
```

**AI Model Configuration:**
- **Claude 3.5 Sonnet** (recommended): `claude-3-5-sonnet-20241022`
- **GPT-4**: `gpt-4-turbo-preview`
- **Budget option**: `gpt-3.5-turbo` (lower quality)

#### Slack (OAuth 2.0)
```
1. In n8n: Credentials → New → Slack OAuth2 API
2. Complete OAuth flow
3. Ensure bot can post to your channel
4. Assign to "Send to Slack" node
```

---

### Step 3: Customize Configuration

#### Set Your X Username
Edit **"Configuration"** node:
```javascript
{
  "xUsername": "YourTwitterHandle",  // Your @username (without @)
  "tweetLimit": 100,                 // Tweets to analyze (50-100 recommended)
  "trendingSearchLimit": 50          // Trending tweets to search (30-100)
}
```

#### Change Schedule
Edit **"Daily 9 AM Trigger"** node:
```javascript
{
  "hour": 9,              // Hour (0-23)
  "minute": 0,            // Minute
  "timezone": "America/New_York"  // Your timezone
}
```

**Or use Manual Trigger** for on-demand:
- Replace Schedule Trigger with Manual Trigger node
- Run whenever you want suggestions

#### Customize Slack Channel
Edit **"Send to Slack"** node:
```javascript
{
  "channel": "#twitter-suggestions",  // Your channel name
  "username": "X Engagement Bot",     // Bot display name
  "icon_emoji": ":bird:"              // Bot icon
}
```

---

## 🎨 Customization Options

### Adjust AI Analysis Depth

**Profile Analysis (Node: "AI Profile Analysis")**
```
Temperature: 0.3 (factual, consistent)
Max Tokens: 2000 (comprehensive profile)

Increase temperature to 0.5 for more creative interpretations
```

**Response Generation (Node: "AI Generate Suggestions")**
```
Temperature: 0.7 (creative, varied)
Max Tokens: 3000 (10 detailed suggestions)

Lower temperature to 0.5 for more conservative responses
```

### Change Number of Suggestions

Edit **"AI Generate Suggestions"** prompt:
```
Change "Select the 10 BEST tweets" to "Select the 15 BEST tweets"
```

Also update **"Aggregate & Rank Tweets"** node:
```javascript
// Change from:
tweets: unique.slice(0, 30)

// To:
tweets: unique.slice(0, 50)  // More candidates for AI to choose from
```

### Add More Search Queries

Edit **"Build Search Queries"** code:
```javascript
// Add custom queries
queries.push('your custom query -is:retweet');
queries.push('(keyword1 OR keyword2) -is:reply');
```

### Filter by Engagement Threshold

Edit **"Aggregate & Rank Tweets"** to filter low-engagement tweets:
```javascript
// After: unique.sort(...)
// Add:
const filtered = unique.filter(t => t.likes >= 10 || t.retweets >= 5);
return [{ json: { tweets: filtered.slice(0, 30), profile } }];
```

---

## 📊 Output Format

### Slack Notification Example

```
🎯 *Daily Tweet Suggestions* - Dec 15, 2025

*1. Tweet from @techinfluencer* (Score: 95/100)
📝 _"Just shipped a new feature using React Server Components.
    The performance gains are incredible! 🚀"_
🔗 https://twitter.com/techinfluencer/status/123456

💡 *Why respond:* Perfect match for your React expertise and
   you often share performance insights
✍️ *Suggested reply:*
> Nice! We saw 40% faster TTI switching to RSC. The streaming
> SSR really shines for data-heavy components 📈

*Strategy:* add_insight
─────────────────────────────────

*2. Tweet from @startupfounder* (Score: 92/100)
...
```

### JSON Structure (for API integration)

```json
{
  "suggestions": [
    {
      "tweet_id": "1234567890",
      "tweet_text": "Original tweet content...",
      "tweet_url": "https://twitter.com/user/status/123",
      "author": "@username",
      "relevance_score": 95,
      "why_respond": "Explanation of relevance",
      "suggested_response": "Pre-filled reply text",
      "response_strategy": "add_insight"
    }
  ]
}
```

---

## 🧪 Testing

### Test Profile Analysis

1. Set Manual Trigger (temporarily)
2. Execute workflow
3. Check execution log at **"Parse Profile JSON"** node
4. Verify profile structure:
   ```json
   {
     "personality_type": "...",
     "humor_style": "...",
     "expertise_areas": [...],
     "writing_style": {...},
     "search_keywords": [...]
   }
   ```

### Test Tweet Matching

1. Check **"Aggregate & Rank Tweets"** output
2. Verify tweets are relevant to your profile
3. Check engagement scores make sense

### Test Response Generation

1. Review Slack message
2. Verify responses match YOUR style
3. Check if you'd actually tweet those responses
4. Adjust AI temperature if needed

---

## 💰 Cost Estimation

### API Costs (per execution)

**X/Twitter API:**
- Free tier: 10,000 tweets/month (Elevated access)
- This workflow uses ~200-300 tweets per run
- **Cost:** Free (or $100/month for higher limits)

**Claude 3.5 Sonnet (Anthropic):**
- Profile Analysis: ~2,000 input tokens + 1,500 output = $0.03
- Response Generation: ~5,000 input + 2,500 output = $0.08
- **Total per run:** ~$0.11

**GPT-4 (OpenAI):**
- Profile Analysis: ~2,000 input + 1,500 output = $0.07
- Response Generation: ~5,000 input + 2,500 output = $0.18
- **Total per run:** ~$0.25

**Daily (30 days):**
- Claude: $3.30/month
- GPT-4: $7.50/month

**Slack:** Free

---

## 🔧 Troubleshooting

### "Rate limit exceeded" from X API

**Solution:**
- X API has rate limits (300 requests/15 min for free tier)
- Add Wait node between searches (3-5 seconds)
- Reduce `trendingSearchLimit` in Configuration

### AI returns invalid JSON

**Solution:**
- Check **"Parse Profile JSON"** and **"Parse Suggestions"** nodes
- They have fallback logic for parsing errors
- Increase Max Tokens if responses are cut off
- Try lowering temperature for more structured output

### Profile doesn't match your style

**Solution:**
- Increase `tweetLimit` to analyze more tweets (100+)
- Ensure you're analyzing original tweets (not RTs/replies)
- Check if your recent tweets are representative of your usual style
- Manually adjust profile in **"Parse Profile JSON"** code

### Suggested responses don't sound like you

**Solution:**
- Adjust AI temperature in **"AI Generate Suggestions"** (try 0.8-0.9)
- Modify the AI prompt to emphasize specific style elements
- Add examples of your actual tweet style to the prompt
- Consider using Claude over GPT-4 (better style matching)

### No relevant tweets found

**Solution:**
- Check `search_keywords` in profile analysis output
- Manually add keywords to **"Build Search Queries"**
- Expand search queries (more OR conditions)
- Lower relevance threshold in AI filtering

---

## 🚀 Advanced Enhancements

### 1. **Add Database Storage**

Store profile and suggestions for tracking:
```
After "Parse Profile JSON":
→ Postgres: Insert into profiles table

After "Parse Suggestions":
→ Postgres: Insert into suggestions table
→ Track which suggestions you actually used
```

### 2. **A/B Test Response Styles**

Generate 2-3 response variations:
```
Modify "AI Generate Suggestions" prompt:
"For each tweet, generate 3 response variations:
1. Professional tone
2. Casual/friendly tone
3. Humorous approach"
```

### 3. **Auto-Schedule Tweets**

Add Buffer/Hootsuite integration:
```
After "Parse Suggestions":
→ HTTP Request: POST to Buffer API
→ Schedule top 3 responses automatically
```

### 4. **Track Engagement Performance**

Monitor which suggestions get best results:
```
Add webhook workflow:
When you tweet a suggested response:
→ Store tweet ID
→ Check engagement after 24h
→ Feed back to AI for learning
```

### 5. **Multi-Platform Support**

Extend to LinkedIn, Reddit, etc.:
```
Duplicate workflow structure
Replace X API nodes with:
→ LinkedIn API
→ Reddit API
Match output format
```

---

## 📈 Performance Tips

### 1. **Optimize API Calls**

- Batch X API requests when possible
- Cache profile analysis for 7 days (doesn't change often)
- Run searches in parallel (use SplitInBatches)

### 2. **Reduce AI Costs**

- Use GPT-3.5-turbo for profile analysis (cheaper)
- Reserve GPT-4/Claude for response generation
- Cache search results for 1 hour
- Run workflow 3x/week instead of daily

### 3. **Improve Result Quality**

- Analyze more tweets (150-200) for better style matching
- Use longer search queries with more context
- Add negative keywords to filter noise
- Manually seed expertise areas in Configuration

---

## 🔐 Security & Privacy

### Best Practices

1. **API Key Storage**
   - Use n8n credentials (encrypted)
   - Never hardcode keys in workflow

2. **X API Permissions**
   - Use read-only access for analysis
   - Write access only if auto-posting

3. **Data Retention**
   - Tweet data is processed in-memory
   - No permanent storage unless you add it
   - Profile data refreshed daily

4. **Slack Security**
   - Use private channel for suggestions
   - Restrict bot to specific channels
   - Don't share API responses publicly

---

## 🎓 Learning Resources

### Understanding Your Results

**Personality Type:**
- MBTI or descriptive analysis
- Use to guide response tone and approach

**Humor Style:**
- Witty: clever wordplay, puns
- Sarcastic: ironic, tongue-in-cheek
- Wholesome: positive, uplifting
- Memes: references, internet culture

**Expertise Areas:**
- AI identifies your main topics
- Used to filter relevant conversations
- Should align with your professional goals

**Writing Style:**
- Tone: overall voice (professional, casual, etc.)
- Length: short punchy vs. detailed explanations
- Punctuation: minimal, standard, or heavy
- Emoji usage: frequency and types

### X Engagement Best Practices

1. **Response Timing:** Reply within 1-4 hours of original tweet
2. **Add Value:** Don't just agree, provide insight or ask questions
3. **Be Genuine:** Use suggestions as starting points, not final copy
4. **Engagement Pattern:** Aim for 5-10 quality replies per day
5. **Follow Up:** Continue conversation if author responds

---

## 📝 Workflow Maintenance

### Weekly

- Review suggestion quality
- Check if profile still matches your style
- Adjust search keywords if needed

### Monthly

- Verify API costs are within budget
- Update expertise areas if focus changed
- Refresh OAuth tokens if needed

### Quarterly

- Re-analyze full tweet history
- Update AI prompts based on results
- Review and optimize search queries

---

## 🤝 Support & Contribution

**Issues or Questions:**
- Check n8n community: https://community.n8n.io
- Review AI model docs (Claude/GPT-4)
- X API docs: https://developer.twitter.com

**Improvements:**
- Fork and customize for your use case
- Share successful modifications
- Report bugs or edge cases

---

## 📄 License

MIT License - Free to use and modify

---

## 🎉 Success Metrics

Track these to measure effectiveness:

1. **Suggestion Relevance:** What % of suggestions do you actually use?
2. **Response Quality:** Do replies sound like you?
3. **Engagement Growth:** Follower growth, reply engagement
4. **Time Saved:** Minutes saved vs. manual research
5. **Conversation Quality:** Meaningful discussions started

**Target:** 30-50% suggestion usage rate = excellent performance

---

## 🔮 Future Enhancements

- **Real-time notifications:** Alert when high-value tweet appears
- **Chrome extension:** One-click reply with suggestions
- **Sentiment analysis:** Avoid controversial topics
- **Competitor tracking:** Monitor specific accounts
- **Thread generation:** Suggest full thread responses
- **Image analysis:** Analyze tweets with images/videos

---

**Enjoy your AI-powered Twitter engagement assistant!** 🚀

Let the AI handle discovery while you focus on authentic conversations.
