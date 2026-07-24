export interface PrdModule {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  description: string;
}

export const PRIORITY_MODULES: PrdModule[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Live operations overview",
    route: "/dashboard",
    description: "A command center that surfaces company health, priorities, and system signals.",
  },
  {
    id: "brain",
    title: "Brain",
    subtitle: "Capture and structure intelligence",
    route: "/blankspace",
    description: "The intake hub for notes, images, meetings, and voice captures that become company memory.",
  },
  {
    id: "knowledge",
    title: "Knowledge",
    subtitle: "The company memory layer",
    route: "/knowledge",
    description: "A searchable repository for projects, prompts, research, and related content.",
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Execution and delivery",
    route: "/projects",
    description: "A structured workspace for milestones, tasks, dependencies, and delivery health.",
  },
  {
    id: "partners",
    title: "Partners",
    subtitle: "Relationship and CRM layer",
    route: "/partners",
    description: "Tracks partner health, active modules, communications, and strategic progress.",
  },
  {
    id: "ai",
    title: "AI",
    subtitle: "Chief of Staff",
    route: "/ai",
    description: "Summarizes work, prepares meetings, and helps retrieve decision context quickly.",
  },
  {
    id: "decisions",
    title: "Decision Log",
    subtitle: "Searchable company memory",
    route: "/decisions",
    description: "Captures the reasoning, alternatives, owner, and impact behind important company decisions.",
  },
  {
    id: "documents",
    title: "Documents",
    subtitle: "Versioned operating hub",
    route: "/documents",
    description: "A central document layer for proposals, contracts, notes, templates, and AI summaries.",
  },
  {
    id: "products",
    title: "Products",
    subtitle: "Roadmaps and delivery",
    route: "/products",
    description: "Keeps products, launches, goals, and feedback coordinated in one place.",
  },
  {
    id: "blueprints",
    title: "Blueprint Library",
    subtitle: "Reusable playbooks",
    route: "/blueprints",
    description: "Organizes workflows, operating patterns, and repeatable execution templates.",
  },
  {
    id: "sales",
    title: "Sales",
    subtitle: "Revenue motion",
    route: "/sales",
    description: "Tracks opportunities, offers, follow-up, and forecasting for the business.",
  },
  {
    id: "operations",
    title: "Operations",
    subtitle: "Delivery and execution",
    route: "/operations",
    description: "Provides a live operating view for delivery health, milestones, and teamwork.",
  },
  {
    id: "people",
    title: "People",
    subtitle: "Team and capacity",
    route: "/people",
    description: "Coordinates staffing, ownership, capacity, and team health at a glance.",
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Budgets and runway",
    route: "/finance",
    description: "Keeps financial health, runway, and budget commitments visible to leadership.",
  },
  {
    id: "insights",
    title: "Insights",
    subtitle: "Signals and momentum",
    route: "/insights",
    description: "Brings trends, performance signals, and business pulse into one layer.",
  },
  {
    id: "automations",
    title: "Automations",
    subtitle: "Workflow orchestration",
    route: "/automations",
    description: "Lets teams manage repeatable automations and AI-driven handoffs.",
  },
  {
    id: "governance",
    title: "Governance",
    subtitle: "Policies and approvals",
    route: "/governance",
    description: "Provides a trusted control surface for approvals, access, and policy review.",
  },
  {
    id: "clients",
    title: "Clients",
    subtitle: "Account and engagement",
    route: "/clients",
    description: "Keeps client relationships, strategic value, and engagement context visible.",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    subtitle: "Offers and channels",
    route: "/marketplace",
    description: "Makes service offerings, channels, and commercial opportunities easier to operate.",
  },
  {
    id: "academy",
    title: "Academy",
    subtitle: "Learning and enablement",
    route: "/academy",
    description: "Supports onboarding, training, and continuous enablement for the company.",
  },
  {
    id: "community",
    title: "Community",
    subtitle: "Feedback and relationships",
    route: "/community",
    description: "Creates a visible layer for community engagement, events, and feedback loops.",
  },
];
