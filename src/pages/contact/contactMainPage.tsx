
import { List } from '@refinedev/antd'
import React from 'react'
import { CompanyContactsTable } from '../company/contacts-table'

export const ContactPage = () => {
  return (
    <div>
        <List title="Contacts">
            <CompanyContactsTable />
        </List>
    </div>
  )
}
