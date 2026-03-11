import React, { useContext } from "react";
import {
  Layout,
  Menu,
  Grid,
  Drawer,
  Button,
  theme,
  ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  UnorderedListOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  type TreeMenuItem,
  useTranslate,
  useLogout,
  useIsExistAuthentication,
  useMenu,
  useLink,
  useWarnAboutChange,
  useCan,
} from "@refinedev/core";

import { drawerButtonStyles } from "./styles.ts";
import type { RefineThemedLayoutSiderProps } from "./types.ts";
import { ThemedTitle } from "./ThemeTitle.tsx";
import { useThemedLayoutContext } from "./useThemedLayoutContext.ts";

type MenuItem = Required<MenuProps>["items"][number];

export const ThemedSider: React.FC<RefineThemedLayoutSiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed,
  activeItemDisabled = false,
  siderItemsAreCollapsed = true,
}) => {
  const { token } = theme.useToken();
  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const isExistAuthentication = useIsExistAuthentication();
  const direction = useContext(ConfigProvider.ConfigContext)?.direction;
  const Link = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { mutate: mutateLogout } = useLogout();

  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? ThemedTitle;

  // ✅ 核心改动：返回 MenuItem[] 而不是 JSX
  const renderTreeView = (
    tree: TreeMenuItem[],
    selectedKey?: string,
  ): MenuItem[] => {
    return tree
      .map((item: TreeMenuItem): MenuItem | null => {
        const { key, name, children, meta, list } = item;
        const parentName = meta?.parent;
        const label = item?.label ?? meta?.label ?? name;
        const icon = meta?.icon;
        const route = list;

        if (children.length > 0) {
          return {
            key: item.key,
            icon: icon ?? <UnorderedListOutlined />,
            label,
            children: renderTreeView(children, selectedKey),
          };
        }

        const isSelected = key === selectedKey;
        const isRoute = !(parentName !== undefined && children.length === 0);

        const linkStyle: React.CSSProperties =
          activeItemDisabled && isSelected ? { pointerEvents: "none" } : {};

        return {
          key: item.key,
          icon: icon ?? (isRoute ? <UnorderedListOutlined /> : undefined),
          label: (
            <>
              <Link to={route ?? ""} style={linkStyle}>
                {label}
              </Link>
              {!siderCollapsed && isSelected && (
                <div className="ant-menu-tree-arrow" />
              )}
            </>
          ),
          style: linkStyle,
        };
      })
      .filter(Boolean) as MenuItem[];
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        translate(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes.",
        ),
      );
      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  // ✅ logout 也改为 MenuItem 对象
  const logoutItem: MenuItem | null = isExistAuthentication
    ? {
        key: "logout",
        icon: <LogoutOutlined />,
        label: translate("buttons.logout", "Logout"),
        onClick: handleLogout,
      }
    : null;

  const defaultExpandMenuItems = siderItemsAreCollapsed
    ? []
    : menuItems.map(({ key }) => key);

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = (): MenuItem[] => {
    if (render) {
      // render prop 仍支持旧的 JSX 方式，包一层
      return render({
        items: items as any, // 兼容旧类型
        logout: logoutItem as React.ReactNode,
        collapsed: siderCollapsed,
      }) as unknown as MenuItem[];
    }
    return [...items, logoutItem].filter(Boolean) as MenuItem[];
  };

  const renderMenu = () => {

    
    return (
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={[...defaultOpenKeys, ...defaultExpandMenuItems]}
        mode="inline"
        style={{
          paddingTop: "8px",
          border: "none",
          overflow: "auto",
          height: "calc(100% - 72px)",
        }}
        onClick={() => setMobileSiderOpen(false)}
        items={renderSider()} // ✅ 使用 items 替代 children
      />
    );
  };

  // ... renderDrawerSider 和其余 JSX 保持不变

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement={direction === "rtl" ? "right" : "left"}
          closable={false}
          width={200}
          styles={{
            body: {
              padding: 0,
            },
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                height: "100vh",
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
              }}
            >
              <div
                style={{
                  width: "200px",
                  padding: "0 16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "64px",
                  backgroundColor: token.colorBgElevated,
                }}
              >
                <RenderToTitle collapsed={false} />
              </div>
              {renderMenu()}
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setMobileSiderOpen(true)}
          icon={<BarsOutlined />}
        />
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.height = "100vh";
    siderStyles.zIndex = 999;
  }
  const renderClosingIcons = () => {
    const iconProps = { style: { color: token.colorPrimary } };
    const OpenIcon = direction === "rtl" ? RightOutlined : LeftOutlined;
    const CollapsedIcon = direction === "rtl" ? LeftOutlined : RightOutlined;
    const IconComponent = siderCollapsed ? CollapsedIcon : OpenIcon;

    return <IconComponent {...iconProps} />;
  };

  return (
    <>
      {fixed && (
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            transition: "all 0.2s",
          }}
        />
      )}
      <Layout.Sider
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === "clickTrigger") {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor: token.colorBgElevated,
            }}
          >
            {renderClosingIcons()}
          </Button>
        }
      >
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            padding: siderCollapsed ? "0" : "0 16px",
            display: "flex",
            justifyContent: siderCollapsed ? "center" : "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor: token.colorBgElevated,
            fontSize: "14px",
          }}
        >
          <RenderToTitle collapsed={siderCollapsed} />
        </div>
        {renderMenu()}
      </Layout.Sider>
    </>
  );
};
