# Sprite Sheet Animator Pro: AI Sprite Engine
> A professional-grade toolkit for generating and animating 8x7 AI-generated sprite sheets with real-time chroma keying.

[English](#english-guide) | [中文说明](#中文使用指南)

---

<a name="english-guide"></a>

## 🌟 Overview
**Sprite Sheet Animator Pro** is a high-performance tool designed for game developers and artists. It bridges the gap between AI generation and game-ready assets by producing perfectly aligned **8-column by 7-row** sprite sheets and providing a specialized web-animator to preview them instantly with background removal.

## 🚀 Key Features
- **Engine Diversity**: Support for Gemini 3 Pro (HQ 2K), Gemini 2.5 Flash, and OpenAI-compatible Custom Endpoints.
- **Magenta Chroma Keying**: Specifically tuned to remove pure magenta (`#ff00ff`) backgrounds—a standard for 2D assets.
- **Micro-adjustment Controls**: Real-time FPS, scale, chroma distance (threshold), and frame inset (crop) adjustments.
- **Standardized Animation Rows**: Pre-prompted for consistent behavior across 7 specific character states.

## 📖 Usage Guide

### 1. Engine Configuration (Mandatory First Step)
To protect your privacy, this app does not request keys on load. You must configure your preferred engine manually:
1. Click the **Gear Icon** in the top-right header.
2. **For Gemini**: Click "Configure Gemini Key". This opens a secure dialog to select your Google AI Studio project key. 
   - *Note: Ensure your GCP project has billing enabled for Gemini 3 Pro features.*
3. **For Custom**: Select "Custom Provider". Enter your Base URL (e.g., `https://api.openai.com/v1`), your API Key, and the specific Model ID (e.g., `dall-e-3`).
4. Click **Save & Commit**.

### 2. The Creator (AI Generation)
- Describe your character in the prompt box.
- The system uses a strict "Logic Architecture" (viewable via the button) to ensure the AI generates an 8x7 grid on a magenta background.
- Click **Initialize Rendering**. Once the sheet appears, click **Animate Character** to start the preview.

### 3. The Animator (Preview & Refine)
The animator slices the sheet into 7 rows of 8 frames each:
- **Row 1**: Idle (Breathing/Blinking)
- **Row 2**: Happy / Love
- **Row 3**: Excited / Celebrate
- **Row 4**: Sleepy / Snoring
- **Row 5**: Working / Task
- **Row 6**: Angry / Surprised / Shy
- **Row 7**: Dragging / Motion
- **Controls**: Use the **Chroma Distance** to fix "halos" and **Frame Inset** to crop away artifacts at frame edges.

---

<a name="中文使用指南"></a>

## 🏮 中文使用指南

## 🌟 项目概览
**Sprite Sheet Animator Pro** 是一款专为游戏开发者打造的专业工具。它能通过 AI 生成标准化的 **8列 × 7行** 精灵图（Sprite Sheet），并提供实时色度键（Chroma Key）动画预览。

## 🚀 核心特性
- **多引擎支持**: 集成 Gemini 3 Pro (2K 高清), Gemini 2.5 Flash (极速), 以及自定义 OpenAI 格式接口。
- **品红抠图优化**: 专门针对纯品红 (`#ff00ff`) 背景设计，这是 2D 游戏素材的工业标准颜色。
- **精细化调节**: 支持 FPS、缩放、抠图阈值（Chroma Distance）以及边缘内切（Frame Inset）实时调节。
- **标准化动作行**: 通过专业 Prompt 约束，确保生成的 7 行动作逻辑统一。

## 📖 操作步骤

### 1. 引擎配置 (首要步骤)
为了保障隐私，系统不会自动请求密钥。使用生成功能前请：
1. 点击顶部导航栏右侧的 **齿轮图标**。
2. **Gemini 用户**: 点击 "Configure Gemini Key"，在弹出的 Google 官方对话框中选择您的项目密钥。
3. **自定义用户**: 选择 "Custom Provider"，输入 Base URL (如 `https://api.openai.com/v1`)、Key 以及模型 ID (如 `dall-e-3`)。
4. 点击 **Save & Commit (保存并提交)**。

### 2. 生成器 (Creator)
- 输入角色描述。系统内置了严格的“逻辑架构”（点击 View Logic 可查看），强制 AI 输出 8x7 网格。
- 点击 **Initialize Rendering**。生成完成后，点击 **Animate Character** 即可跳转预览。

### 3. 动画器 (Animator)
动画器将图片切分为 7 行，每行包含 8 帧连续动画：
- **第 1 行**: 待机 (Idle - 呼吸与眨眼)
- **第 2 行**: 快乐 / 示爱 (Happy / Love)
- **第 3 行**: 兴奋 / 庆祝 (Excited)
- **第 4 行**: 困倦 / 睡觉 (Sleepy)
- **第 5 行**: 工作 / 交互 (Working)
- **第 6 行**: 愤怒 / 害羞 (Angry / Shy)
- **第 7 行**: 拖拽 / 受击 (Dragging)
- **调节技巧**: 若边缘有杂色，增加 **Chroma Distance** 阈值；若帧边缘有线条，调节 **Frame Inset** 进行内裁切。

---
*© 2025 Sprite Sheet Animator Pro • Powered by Gemini AI*