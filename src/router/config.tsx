import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ServiceDetailPage from "../pages/service-detail/page";
import AboutPage from "../pages/about/page";
import PortfolioPage from "../pages/portfolio/page";
import PromptPage from "../pages/prompt/page";
import BooksPage from "../pages/books/page";
import BlogPage from "../pages/blog/page";
import BlogDetailPage from "../pages/blog-detail/page";
import MembershipsPage from "../pages/memberships/page";
import DashboardPage from "../pages/dashboard/page";
import DashboardPortfolioPage from "../pages/dashboard/portfolio/page";
import DashboardPortfolioDetailPage from "../pages/dashboard/portfolio/detail/page";
import DashboardBooksPage from "../pages/dashboard/books/page";
import DashboardBookDetailPage from "../pages/dashboard/books/detail/page";
import DashboardClientsPage from "../pages/dashboard/clients/page";
import DashboardClientDetailPage from "../pages/dashboard/clients/detail/page";
import DashboardPromptsPage from "../pages/dashboard/prompts/page";
import DashboardPromptDetailPage from "../pages/dashboard/prompts/detail/page";
import DashboardBlogPage from "../pages/dashboard/blog/page";
import DashboardBlogDetailPage from "../pages/dashboard/blog/detail/page";
import DashboardMessagesPage from "../pages/dashboard/messages/page";
import DashboardMessageDetailPage from "../pages/dashboard/messages/detail/page";
import DashboardServicesPage from "../pages/dashboard/services/page";
import DashboardServiceDetailPage from "../pages/dashboard/services/detail/page";
import DashboardAnalyticsPage from "../pages/dashboard/analytics/page";
import DashboardSettingsPage from "../pages/dashboard/settings/page";
import DashboardAccountPage from "../pages/dashboard/account/page";
import ServicesPage from "../pages/services/page";
import BookDetailPage from "../pages/book-detail/page";
import ContactPage from "../pages/contact/page";
import LoginPage from "../pages/auth/login/page";
import AuthGuard from "../components/feature/AuthGuard";

const dashboardRoutes: RouteObject[] = [
  { path: "/dashboard", element: <AuthGuard><DashboardPage /></AuthGuard> },
  { path: "/dashboard/portfolio", element: <AuthGuard><DashboardPortfolioPage /></AuthGuard> },
  { path: "/dashboard/portfolio/:id", element: <AuthGuard><DashboardPortfolioDetailPage /></AuthGuard> },
  { path: "/dashboard/books", element: <AuthGuard><DashboardBooksPage /></AuthGuard> },
  { path: "/dashboard/books/:id", element: <AuthGuard><DashboardBookDetailPage /></AuthGuard> },
  { path: "/dashboard/orders", element: <AuthGuard><DashboardBooksPage /></AuthGuard> },
  { path: "/dashboard/clients", element: <AuthGuard><DashboardClientsPage /></AuthGuard> },
  { path: "/dashboard/clients/:id", element: <AuthGuard><DashboardClientDetailPage /></AuthGuard> },
  { path: "/dashboard/prompts", element: <AuthGuard><DashboardPromptsPage /></AuthGuard> },
  { path: "/dashboard/prompts/:id", element: <AuthGuard><DashboardPromptDetailPage /></AuthGuard> },
  { path: "/dashboard/blog", element: <AuthGuard><DashboardBlogPage /></AuthGuard> },
  { path: "/dashboard/blog/:id", element: <AuthGuard><DashboardBlogDetailPage /></AuthGuard> },
  { path: "/dashboard/messages", element: <AuthGuard><DashboardMessagesPage /></AuthGuard> },
  { path: "/dashboard/messages/:id", element: <AuthGuard><DashboardMessageDetailPage /></AuthGuard> },
  { path: "/dashboard/services", element: <AuthGuard><DashboardServicesPage /></AuthGuard> },
  { path: "/dashboard/services/:id", element: <AuthGuard><DashboardServiceDetailPage /></AuthGuard> },
  { path: "/dashboard/analytics", element: <AuthGuard><DashboardAnalyticsPage /></AuthGuard> },
  { path: "/dashboard/settings", element: <AuthGuard><DashboardSettingsPage /></AuthGuard> },
  { path: "/dashboard/account", element: <AuthGuard><DashboardAccountPage /></AuthGuard> },
  { path: "/dashboard/create-account", element: <AuthGuard><DashboardAccountPage /></AuthGuard> },
];

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/portfolio", element: <PortfolioPage /> },
  { path: "/prompt", element: <PromptPage /> },
  { path: "/books", element: <BooksPage /> },
  { path: "/books/:id", element: <BookDetailPage /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/blog/:slug", element: <BlogDetailPage /> },
  { path: "/memberships", element: <MembershipsPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/services/:id", element: <ServiceDetailPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  ...dashboardRoutes,
  { path: "*", element: <NotFound /> },
];

export default routes;