# SpaceBreaker 项目分析

## 项目简介
这是一个基于 **Cocos Creator 3.8.7** 的 2D 竖版射击小游戏项目，代码组织采用 `extensions/app` 提供的应用框架（UI 管理、音频管理、控制器、任务流）+ `@gamex/cc-ecs` 的 ECS 结构来实现战斗逻辑。

## 目录结构（核心）
```text
SpaceBreaker/
├─ assets/
│  ├─ app/                              # 应用入口与启动配置
│  │  ├─ app.ts                         # App 单例入口，连接生命周期回调
│  │  ├─ handle.ts                      # ccc/app 启动阶段钩子
│  │  └─ setting.ts                     # UI/音频全局设置（默认 PageHome）
│  ├─ app-appinit/                      # 首屏初始化页面
│  │  └─ view/AppInit.ts
│  ├─ app-builtin/                      # 内置控制层
│  │  ├─ app-admin/executor.ts          # 视图/管理器注册与类型映射
│  │  └─ app-controller/GameController.ts # 游戏事件总线（射击/刷怪/回收等）
│  ├─ app-bundle/                       # 主游戏 UI 资源包
│  │  └─ app-view/
│  │     ├─ page/
│  │     │  ├─ home/                    # 首页 PageHome
│  │     │  └─ game/                    # 战斗页 PageGame + ECS 逻辑
│  │     │     └─ native/expansion/ecs/
│  │     │        ├─ component/         # 玩家/敌人/道具/伤害/销毁等组件
│  │     │        ├─ entity/            # MyEntity
│  │     │        ├─ singleton/         # InputSingleton/DataSingleton
│  │     │        └─ system/            # Input/Shoot/Enemy/Collide/Harm/Destroy
│  │     ├─ paper/                      # 子界面（HUD）
│  │     │  ├─ home/index               # 首页操作面板
│  │     │  └─ game/index               # 对战操作面板
│  │     └─ pop/
│  │        ├─ tip/                     # 提示弹窗
│  │        └─ over/                    # GameOver 弹窗
│  ├─ app-scene/main.scene              # 主场景
│  └─ pkg-export/@gamex/                # 导出的基础库（cc-ecs/cc-sap 等）
├─ extensions/
│  └─ app/                              # 项目使用的通用框架扩展（Core/BaseView/UI/Sound）
├─ settings/                            # Cocos 编辑器配置
├─ profiles/                            # Cocos 配置档
├─ native/                              # 原生平台工程（iOS 等）
├─ library/                             # 资源导入缓存（自动生成）
├─ temp/                                # 编译与预览临时文件（自动生成）
├─ package.json
└─ readme.md
```

## 功能与玩法
1. **启动流程**
- `assets/app/setting.ts` 将默认 UI 设为 `PageHome`。
- `PageHome` 打开后会预加载战斗页、弹窗和音频资源（`music/war`、`effect/shoot`、`effect/hit`、`effect/eat`、`music/over`）。

2. **页面流程**
- 首页：`PageHome + PaperHomeIndex`。
- 点击开始后进入：`PageGame + PaperGameIndex`。
- 玩家死亡后弹出 `PopOver`，按钮点击返回 `PageHome`。

3. **核心战斗机制（ECS）**
- 战斗页 `PageGame` 初始化 ECS 世界，注册系统：
  - `InputSystem`：处理玩家触摸位置。
  - `EnemySystem`：定时刷怪（约每 0.8 秒）。
  - `ShootSystem`：玩家移动状态下自动开火。
  - `MoveSystem`：统一移动逻辑。
  - `CollideSystem`：碰撞检测（基于 SAP），处理子弹/敌人/玩家/道具交互。
  - `HarmSystem`：结算伤害与敌人血量。
  - `DestroySystem`：实体销毁、掉落道具、游戏结束状态处理。

4. **操作与节奏**
- 玩家通过触摸拖动飞船移动。
- 按住/移动时进入 `move` 状态并持续射击；松手后回到 `idle`。
- 背景滚动速度在常态和加速间平滑过渡。

5. **战斗对象**
- 玩家：攻击、射速、分裂弹道等参数由 `PlayerComponent` 管理（包含上限）。
- 敌人：携带血量并播放受击动画。
- 子弹：由对象池管理，减少频繁创建销毁开销。
- 道具：当前已实现金币掉落与收集反馈（含飞向 UI 金币位的表现）。

6. **失败与结算**
- 玩家与敌人碰撞后进入销毁流程，`DataSingleton.over = true`。
- 进入结束状态后播放 `music/over` 并展示 `PopOver`。

## 备注
- `library/`、`temp/` 为构建/缓存目录，通常不作为业务代码阅读重点。
- 项目存在部分框架模板文件（如说明 `.md`、占位回调），不影响主玩法逻辑。
