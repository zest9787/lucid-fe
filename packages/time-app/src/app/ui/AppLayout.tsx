import { DatabaseOutlined, EditOutlined, FormOutlined } from '@ant-design/icons'
import { Layout, Menu, Typography } from 'antd'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import './AppLayout.scss'

const menuItems = [
  {
    icon: <DatabaseOutlined />,
    key: '/mileage-search',
    label: <Link to="/mileage-search">Mileage Search</Link>,
  },
  {
    icon: <EditOutlined />,
    key: '/mileage-editor',
    label: <Link to="/mileage-editor">Mileage Editor</Link>,
  },
  {
    icon: <FormOutlined />,
    key: '/mileage-editor-antd',
    label: <Link to="/mileage-editor-antd">Mileage Antd Editor</Link>,
  },
]

export function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <Layout className="app-layout">
      <Layout.Sider className="app-layout__sider" width={220}>
        <Typography.Title className="app-layout__logo" level={4}>
          Time App
        </Typography.Title>
        <Menu items={menuItems} mode="inline" selectedKeys={[pathname]} />
      </Layout.Sider>
      <Layout>
        <Layout.Content className="app-layout__content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
