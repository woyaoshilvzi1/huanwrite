# 正式资产清单

## AI 配置

- `data/assets/ai/agents/default-webnovel-agent.json`：中文网文默认 Agent 配置。
- `.env.example`：本地环境变量模板，不保存密钥。

## 写作技能资产

- `data/assets/skills/chinese-novelist/`：中文小说分阶段创作流程、标题、人物、章节、润色和验收规则。
- `data/assets/skills/chinese-webnovel/`：中文网文选材、规划、开头、章纲、模仿检索、去 AI 味和质量检查规则。

## 规则资产

- `data/assets/topic-rules/`：题材筛选规则。
- `data/assets/writing-rules/`：写作执行规则。
- `data/assets/quality-rules/`：质量检查清单。
- `data/assets/templates/`：规划、章节和候选正文模板。

## 语料资产

- `data/assets/corpus/webnovel/analysis/`：文章画像、摘录、统计和模仿索引。
- `data/assets/corpus/webnovel/data/`：语料正文、元数据和本地文件索引。
- `data/assets/corpus/webnovel/genre-demos/`：各类主题短篇 demo。

## 语料脚本

- `scripts/corpus/search_corpus_examples.py`：本地语料检索。
- `scripts/corpus/build_webnovel_corpus_assets.py`：语料分析资产构建。
- `scripts/corpus/fetch_content_raw.py`：原始内容抓取工具。
- `scripts/corpus/scrape_yanxuan_recent_posts.py`：公开页面采集工具。
- `scripts/corpus/check_chapter_wordcount.py`：章节字数检查。
