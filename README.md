# Sprite Sheet Animator Pro: AI Sprite Engine
> A professional-grade toolkit for generating and animating 8x7 AI sprite sheets.

[English](#english-guide) | [中文说明](#中文使用指南)

---

<a name="english-guide"></a>

## 🌟 Overview
**Sprite Sheet Animator Pro** is a high-performance React application designed for game developers and artists. It leverages Gemini's vision models (and custom providers) to generate perfectly aligned 8x7 sprite sheets and provides a real-time chroma-key animator to preview your characters instantly.

## 🚀 Key Features
- **AI Sprite Generator**: Generate consistent character animations with specialized prompts.
- **Multi-Engine Support**: Choose between Gemini 3 Pro (2K HQ), Gemini 2.5 Flash (Fast), or any Custom OpenAI-compatible endpoint.
- **Real-time Chroma Keying**: Automatically removes magenta (#ff00ff) backgrounds in-browser.
- **Precise Animation Controls**: Adjust FPS, scale, padding (inset), and chroma threshold on the fly.
- **8-Directional/Action Logic**: Pre-configured for 7 standardized animation states (Idle, Happy, Excited, etc.).

## 📖 Usage Guide

### 1. Configuration (First Step)
Unlike other tools, Sprite Sheet Animator Pro does not nag you for a key on startup.
- Click the **Gear Icon** in the header to open **Engine Config**.
- **Gemini Users**: Click "Configure Gemini Key" to select your Google AI Studio project key.
- **Custom Users**: Select "Custom Provider" and enter your Base URL (e.g., `https://api.openai.com/v1`), API Key, and Model ID.

### 2. The Creator Tab (Generating Sprites)
- Enter a character description (e.g., "A small blue dragon with golden horns").
- Click **Initialize Rendering**. 
- The AI will generate an 8x7 grid. Once finished, click **Animate Character** to send it to the Animator.

### 3. The Animator Tab (Previewing)
- **Animation States**: Select from 7 rows representing different moods/actions.
- **Playback Settings**:
    - **FPS**: Controls speed.
    - **Character Scale**: Zoom in/out of the frame.
    - **Frame Inset (Crop)**: Useful if the AI generated borders or artifacts near the edges of cells.
    - **Chroma Distance**: Adjust how aggressively the magenta background is removed.
- **Stage Theme**: Switch between Checkboard, Dark, or Light backgrounds to test visibility.

## 🛠 Technical Specifications
For the best results with manual uploads:
- **Grid**: Exactly 8 columns and 7 rows.
- **Background**: Pure Magenta (`#ff00ff`).
- **Aspect Ratio**: Target ~1.14 (8:7).
- **Format**: PNG (preferred) or JPG.

---

<a name="中文使用指南"></a>

## 🏮 中文使用指南

## 🌟 项目概览
**Sprite Sheet Animator Pro** 是一款专为游戏开发者和艺术家设计的高性能工具。它利用 Gemini 视觉模型（及自定义供应商）生成完美对齐的 8x7 精灵图，并提供实时色度键（Chroma Key）动画器，让您可以立即预览角色效果。

## 🚀 核心特性
- **AI 精灵图生成**: 使用专业提示词逻辑生成连贯的角色动画。
- **多引擎支持**: 可选 Gemini 3 Pro (2K 高清), Gemini 2.5 Flash (快速), 或任何兼容 OpenAI 格式的自定义接口。
- **实时背景抠图**: 浏览器内自动消除品红 (#ff00ff) 背景。
- **精确动画控制**: 实时调节 FPS、缩放、边距（内切）和色度阈值。
- **标准化动作逻辑**: 预设 7 种动画状态（待机、快乐、兴奋、睡眠、工作、愤怒、拖拽）。

## 📖 操作步骤

### 1. 引擎配置 (首要步骤)
为了保障隐私，系统不会在进入项目时弹出配置。
- 点击顶部导航栏的 **齿轮图标** 进入 **引擎配置**。
- **Gemini 用户**: 点击“配置 Gemini 密钥”选择您的 Google AI Studio 项目密钥。
- **自定义用户**: 选择“自定义供应商”，输入您的 Base URL (例如 `https://api.openai.com/v1`)、API Key 和模型 ID (如 `dall-e-3`)。

### 2. 生成器 (Creator)
- 输入角色描述（例如：“一只圆滚滚的小蓝龙，金色犄角”）。
- 点击 **Initialize Rendering (初始化渲染)**。
- AI 将生成一张 8x7 的精灵图。完成后点击 **Animate Character** 即可跳转预览。

### 3. 动画器 (Animator)
- **动画状态**: 点击下方的动作按钮切换 7 种不同的动作行。
- **播放设置**:
    - **FPS**: 控制动画速度。
    - **Character Scale**: 角色缩放比例。
    - **Frame Inset (内切)**: 如果 AI 生成的边缘有杂色，增加此数值可剔除边缘。
    - **Chroma Distance**: 调节品红背景消除的强度。
- **舞台主题**: 切换棋盘格、深色或浅色背景。

## 🛠 技术规范
如需手动上传素材，请遵循以下标准：
- **网格**: 严格的 8 列 × 7 行。
- **背景**: 纯品红 (`#ff00ff`)。
- **长宽比**: 建议接近 1.14 (8:7)。
- **格式**: 推荐 PNG (低噪点) 或 JPG。

---
*© 2025 Sprite Sheet Animator Pro • Powered by Gemini AI*