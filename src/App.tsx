import { Authenticated, GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";


import {dataProvider, liveProvider} from "./providers/data";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./providers/auth";

import {Home, ForgotPassword, Login, Register, CompanyList, CreateCompany, EditPage} from "./pages/page"
import Layout from "./components/layout/layout";
import { resources } from "./config/resources";
import { CompanyContactsTable } from "./pages/company/contacts-table";
import { ContactPage } from "./pages/contact/contactMainPage";
import TaskList from "./pages/task/tasklist";




function App() {
  return (
    <BrowserRouter>
      {/*<GitHubBanner /> */} {/* 关掉这个就没有Github rate */}
      <RefineKbarProvider>
       
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "OEQMas-DwiBjj-pWcUVC",
                  liveMode: "auto",
                }}
              >
                <Routes>
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    element={<Authenticated 
                                key="authenticated-layout"
                                fallback={<CatchAllNavigate to="/login" />}
                            >
                                <Layout>
                                  <Outlet />
                                </Layout>
                              
                            </Authenticated>
                    }
                  >
                    <Route index element={<Home />} />

                    <Route path="/companies">
                      <Route index element={<CompanyList />} />
                      <Route path="new" element={<CreateCompany />} />
                      <Route path="edit/:id" element={<EditPage />} />
                    </Route>

                    <Route path="/contacts">
                      <Route index element={<ContactPage />}/>
                    </Route>

                    <Route path="/tasks">
                      <Route index element={<TaskList />} />
                    </Route>
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel /> {/* 删掉或关掉这个devtools就不见了 */}
            </DevtoolsProvider>
          </AntdApp>
        
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
