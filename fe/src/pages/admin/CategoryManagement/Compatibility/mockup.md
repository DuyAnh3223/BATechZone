// Route: /admin/categories/compatibility

┌────────────────────────────────────────────────────────────────────┐
│ 🔗 Quản lý Tương thích (Compatibility Rules)                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [🔍 Search rules...]                      [➕ Tạo Rule Mới]      │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ ID │ Rule Name                    │ From → To   │ Status  │   │
│  ├────┼──────────────────────────────┼─────────────┼─────────┤   │
│  │ 1  │ CPU-Mainboard Socket         │ CPU → MB    │ ✅ Active│   │
│  │ 2  │ CPU-RAM DDR Type             │ CPU → RAM   │ ✅ Active│   │
│  │ 3  │ Mainboard-RAM DDR Type       │ MB → RAM    │ ✅ Active│   │
│  │ 4  │ Mainboard-Case Form Factor   �� MB → Case   │ ✅ Active│   │
│  │ 5  │ Case-GPU Max Length          │ Case → GPU  │ ✅ Active│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Actions:  [👁️ View] [✏️ Edit] [🔧 Manage Mappings] [🗑️ Delete]   │
└────────────────────────────────────────────────────────────────────┘


// Route: /admin/categories/compatibility/create

┌────────────────────────────────────────────────────────────────────┐
│ ➕ Tạo Compatibility Rule Mới                                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Rule Name:                                                         │
│  [___________________________________________]                      │
│  VD: CPU-Mainboard Socket Compatibility                            │
│                                                                     │
│  ┌─────────────────────────┬───��─────────────────────┐            │
│  │ Category 1 (Source)     │ Category 2 (Target)     │            │
│  ├─────────────────────────┼─────────────────────────┤            │
│  │ [v CPU              ▼]  │ [v Mainboard        ▼]  │            │
│  │                         │                         │            │
│  │ Attribute:               │ Attribute:              │            │
│  │ [v CPU theo Socket  ▼]  │ [v Socket Hỗ Trợ    ▼]  │            │
│  └─────────────────────────┴─────────────────────────┘            │
│                                                                     │
│  Match Type:                                                        │
│  ○ Exact Match      (1 → 1, value phải giống chính xác)           │
│  ○ One-to-Many      (1 → nhiều, cần mapping table)                │
│  ○ Contains         (chứa substring)                               │
│                                                                     │
│  Note (optional):                                                   │
│  [____________________________________________________________]     │
│  [____________________________________________________________]     │
│                                                                     │
│  [Cancel]                                      [💾 Create Rule]    │
└────────────────────────────────────────────────────────────────────┘

// Route: /admin/categories/compatibility/rules/: ruleId/mappings

┌────────────────────────────────────────────────────────────────────┐
│ 🔧 Quản lý Mappings:  CPU-Mainboard Socket Compatibility            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Rule Info:                                                         │
│  • Category 1: CPU (attribute:  CPU theo Socket)                    │
│  • Category 2: Mainboard (attribute: Socket Hỗ Trợ)               │
│  • Match Type: Exact                                                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ ➕ Add New Mapping                                      │       │
│  ├─────────────────────────────────────────────────────────┤       │
│  │ CPU Socket:         [v LGA 1700 (12th, 13th, 14th)  ▼]  │       │
│  │ Mainboard Socket:  [v LGA 1700 (12th, 13th, 14th)  ▼]  │       │
│  │                                        [➕ Add Mapping] │       │
│  │                                                          │       │
│  │ 🪄 [Auto-add Matching Values] (Add all với tên giống)  │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
│  Existing Mappings (5):                                             │
│  ┌───────────────────────────────┬──────────────────────────┐      │
│  │ CPU Socket                    │ Mainboard Socket         │      │
│  ├───────────────────────────────┼──────────────────────────┤      ���
│  │ LGA 1200 (10th)               │ LGA 1200 (10th)      [🗑️] │      │
│  │ LGA 1700 (12th, 13th, 14th)   │ LGA 1700 (...)       [🗑️] │      │
│  │ LGA 1851 (Core Ultra)         │ LGA 1851 (...)       [🗑️] │      │
│  │ AM4 (3000, 5000)              │ AM4 (3000, 5000)     [🗑️] │      │
│  │ AM5 (7000, 9000)              │ AM5 (7000, 9000)     [🗑️] │      │
│  └───────────────────────────────┴──────────────────────────┘      │
│                                                                     │
│  [← Back to Rules]                                                 │
└────────────────────────────────────────────────────────────────────┘