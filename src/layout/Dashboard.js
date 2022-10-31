import {
  AreaChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  BranchesOutlined,
  PullRequestOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, message } from "antd";
import { Header } from "antd/lib/layout/layout";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserInfoModal from "../components/UserInfoModal";
import config from "../config";
import AppContext from "../context/AppContext";
import { getLocalStorage, removeLocalStorage } from "../helpers";

const DashboardLayout = ({ children }) => {
  const { Content, Sider } = Layout;
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

  useEffect(() => {
    !getLocalStorage("sid") && navigate("/");
  }, []);

  const handleLogout = async () => {
    const { url, method } = config.paths.logout;
    try {
      await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "logout":
        removeLocalStorage("sid");
        removeLocalStorage("rid");
        removeLocalStorage("userPayload");
        handleLogout();
        navigate("/");
        break;
      case "profile":
        setUserInfoModalVisible(true);
        break;
      default:
        message.info("Invalid action");
        break;
    }
  };

  const dropdownMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: user?.email,
          key: "profile",
          icon: <ProfileOutlined />,
        },
        {
          label: "Logout",
          key: "logout",
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  const onCloseUserInfoModal = () => {
    setUserInfoModalVisible(false);
  };

  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <UserInfoModal
        onCancel={onCloseUserInfoModal}
        onOk={onCloseUserInfoModal}
        data={user}
        isVisible={userInfoModalVisible}
      />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={collapsed && "collapse"}
      >
        <div className="logo" />
        {user?.role === "admin" && (
          <NavLink
            className={({ isActive }) =>
              isActive ? "menu-sidebar active" : "menu-sidebar"
            }
            to="/user"
          >
            <UserOutlined />
            {!collapsed && <p>User</p>}
          </NavLink>
        )}
        <NavLink
          className={({ isActive }) =>
            isActive ? "menu-sidebar active" : "menu-sidebar"
          }
          to="/atlas"
        >
          <AreaChartOutlined />
          {!collapsed && <p>Atlas</p>}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "menu-sidebar active" : "menu-sidebar"
          }
          to="/types"
        >
          <BranchesOutlined />
          {!collapsed && <p>Types</p>}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "menu-sidebar active" : "menu-sidebar"
          }
          to="/atlas-request"
        >
          <PullRequestOutlined />
          {!collapsed && <p>Atlas Request</p>}
        </NavLink>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            color: "#ffffff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown.Button
            overlay={dropdownMenu}
            icon={<UserOutlined />}
          ></Dropdown.Button>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
