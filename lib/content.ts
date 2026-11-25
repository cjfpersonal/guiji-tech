export type ProductCategory = {
  slug: string;
  title: string;
  english: string;
  description: string;
  examples: string[];
  applications: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "processors",
    title: "处理器与可编程逻辑",
    english: "PROCESSORS & FPGA",
    description: "面向计算密集、接口复杂与快速迭代项目的核心器件寻源。",
    examples: ["MPU / CPU / GPU", "FPGA / CPLD", "SoC / DSP"],
    applications: "边缘计算、机器视觉、通信与控制",
  },
  {
    slug: "mcu",
    title: "微控制器与嵌入式",
    english: "MCU & EMBEDDED",
    description: "覆盖控制、连接与实时处理需求，并协同评估替代与迁移路径。",
    examples: ["8 / 16 / 32 位 MCU", "无线 SoC", "开发套件与调试器"],
    applications: "工业控制、智能终端、物联网",
  },
  {
    slug: "analog",
    title: "模拟与混合信号",
    english: "ANALOG & MIXED-SIGNAL",
    description: "围绕信号链完整性，支持关键模拟器件的选型与供应协同。",
    examples: ["放大器", "数据转换器", "接口与时钟器件"],
    applications: "精密测量、医疗电子、数据采集",
  },
  {
    slug: "power",
    title: "电源管理与功率器件",
    english: "POWER MANAGEMENT",
    description: "从电源树到功率级，关注器件可得性、热设计与验证约束。",
    examples: ["DC-DC / LDO", "MOSFET / IGBT", "电源模块与驱动"],
    applications: "储能、电源系统、电机驱动",
  },
  {
    slug: "rf",
    title: "射频与无线连接",
    english: "RF & CONNECTIVITY",
    description: "支持通信链路与无线终端中的关键射频、连接器件需求。",
    examples: ["射频前端", "收发器", "Wi-Fi / 蓝牙 / 蜂窝器件"],
    applications: "通信设备、定位、无线终端",
  },
  {
    slug: "memory",
    title: "存储器件",
    english: "MEMORY",
    description: "针对容量、封装、温度等级与生命周期要求开展需求匹配。",
    examples: ["DRAM / SRAM", "NAND / NOR Flash", "eMMC / EEPROM"],
    applications: "嵌入式系统、数据记录、启动存储",
  },
  {
    slug: "sensors",
    title: "传感器与光电",
    english: "SENSORS & OPTOELECTRONICS",
    description: "覆盖感知、显示与光电器件，兼顾规格适配与交付节奏。",
    examples: ["运动与环境传感", "图像传感器", "LED 与光耦"],
    applications: "机器人、智能感知、人机交互",
  },
  {
    slug: "passives",
    title: "分立、被动与机电",
    english: "DISCRETE & ELECTROMECHANICAL",
    description: "围绕整板 BOM 补齐配套器件，减少多来源协同成本。",
    examples: ["阻容感与晶振", "二极管与保护器件", "连接器与继电器"],
    applications: "整板配套、产线补料、维修保障",
  },
];

export const manufacturers = [
  "Analog Devices",
  "Infineon",
  "Microchip",
  "NXP",
  "onsemi",
  "Renesas",
  "STMicroelectronics",
  "Texas Instruments",
];

export const supplySteps = [
  {
    number: "01",
    title: "定义真实约束",
    english: "DEFINE",
    description: "核对完整型号、封装、数量、目标日期与可接受条件，避免无效寻源。",
  },
  {
    number: "02",
    title: "拆解供应路径",
    english: "SOURCE",
    description: "按项目约定检索可行渠道，区分现货、排单、替代与工程协同路径。",
  },
  {
    number: "03",
    title: "验证与风险透明",
    english: "VERIFY",
    description: "将批次、追溯资料、检验要求和异常边界纳入报价与交付沟通。",
  },
  {
    number: "04",
    title: "协同到交付",
    english: "COORDINATE",
    description: "围绕确认、物流、到货反馈与后续需求建立连续协同，而非单次报价。",
  },
];

export const industries = [
  {
    slug: "industrial",
    title: "工业控制与自动化",
    english: "INDUSTRIAL",
    description: "针对长生命周期、停产风险与维修补料，协同核心控制、隔离、接口和功率器件。",
    needs: ["生命周期风险管理", "长周期物料规划", "替代料工程评估"],
  },
  {
    slug: "automotive",
    title: "汽车电子",
    english: "AUTOMOTIVE ELECTRONICS",
    description: "围绕车规等级、批次要求和变更约束组织需求；具体合规等级以项目资料为准。",
    needs: ["温度与等级核对", "批次资料协同", "PCN / EOL 信息关注"],
  },
  {
    slug: "energy",
    title: "能源与电力电子",
    english: "ENERGY & POWER",
    description: "支持功率变换、储能与充电场景的功率器件、驱动、采样和控制链路需求。",
    needs: ["功率器件寻源", "关键参数匹配", "热与可靠性验证协同"],
  },
  {
    slug: "medical",
    title: "医疗与健康电子",
    english: "MEDICAL ELECTRONICS",
    description: "关注精密信号链、数据完整性与追溯要求，配合客户既定的验证和合规流程。",
    needs: ["精密模拟器件", "可追溯资料", "变更影响评估"],
  },
  {
    slug: "communications",
    title: "通信与边缘计算",
    english: "CONNECTIVITY & EDGE",
    description: "面向高性能处理器、可编程逻辑、时钟和高速接口的复杂供给与选型约束。",
    needs: ["高端芯片寻源", "高速信号链配套", "供应节奏协同"],
  },
  {
    slug: "robotics",
    title: "机器人与智能终端",
    english: "ROBOTICS & DEVICES",
    description: "从原型到量产衔接控制、感知、连接与电源器件，并支持嵌入式方案协同。",
    needs: ["控制与感知配套", "嵌入式方案设计", "试产到量产衔接"],
  },
];

export const qualityStages = [
  {
    number: "Q1",
    title: "需求规格锁定",
    description: "以完整型号、封装、等级、批次和验收要求作为执行基线。",
  },
  {
    number: "Q2",
    title: "来源资料核对",
    description: "按项目要求收集并核对来源与追溯资料；资料范围在交易前确认。",
  },
  {
    number: "Q3",
    title: "外观与标签检查",
    description: "按约定检查包装、标签、丝印和外观，并记录异常，不以图片替代实物结论。",
  },
  {
    number: "Q4",
    title: "检测与验收协同",
    description: "如需电性或第三方检测，由双方约定项目、标准、样品与判定方式。",
  },
  {
    number: "Q5",
    title: "批次记录归档",
    description: "关联需求、批次、资料和交付记录，为后续复查保留清晰路径。",
  },
];
