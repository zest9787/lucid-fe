import { Button, Layout, Space, Typography } from 'antd'
import { useState } from 'react'
import {
  MultiUserSearchModal,
  UserSearchModal,
  type UserSearchItem,
} from 'ui-common/user-search-modal'
import './HomePage.scss'

export function HomePage() {
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false)
  const [isMultiUserSearchOpen, setIsMultiUserSearchOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<UserSearchItem[]>([])

  return (
    <Layout className="home-page">
      <Layout.Header className="home-page__header">
        <Typography.Title level={4}>time-app</Typography.Title>
      </Layout.Header>
      <Layout.Content className="home-page__content">
        <section className="home-page__panel">
          <Space orientation="vertical" size={16}>
            <Typography.Title level={2}>Time App</Typography.Title>
            <Typography.Text type="secondary">
              Common user search modal integration is ready.
            </Typography.Text>
            <Button type="primary" onClick={() => setIsUserSearchOpen(true)}>
              Search User
            </Button>
            <Typography.Text>
              {selectedUser
                ? `${selectedUser.name} (${selectedUser.email})`
                : 'Selected user will appear here.'}
            </Typography.Text>
            <Button type="primary" onClick={() => setIsMultiUserSearchOpen(true)}>
              Search Users
            </Button>
            <Space className="home-page__selected-users" direction="vertical" size={4}>
              {selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <Typography.Text key={user.id}>
                    {user.name} ({user.email})
                  </Typography.Text>
                ))
              ) : (
                <Typography.Text>Selected users will appear here.</Typography.Text>
              )}
            </Space>
          </Space>
        </section>
      </Layout.Content>
      <UserSearchModal
        open={isUserSearchOpen}
        onCancel={() => setIsUserSearchOpen(false)}
        onSelect={(user) => {
          setSelectedUser(user)
          setIsUserSearchOpen(false)
        }}
      />
      <MultiUserSearchModal
        open={isMultiUserSearchOpen}
        onCancel={() => setIsMultiUserSearchOpen(false)}
        onSelect={(users) => {
          setSelectedUsers(users)
          setIsMultiUserSearchOpen(false)
        }}
      />
    </Layout>
  )
}
