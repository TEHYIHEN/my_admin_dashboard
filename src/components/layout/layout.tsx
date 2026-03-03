import { ThemedLayout, ThemedTitle } from '@refinedev/antd'
import React from 'react'
import Header from './header'
import { FundProjectionScreenOutlined } from '@ant-design/icons'

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <ThemedLayout

      Header={Header}
      Title={(titleProps) => (

        <ThemedTitle {...titleProps} text="Teh Project" icon={<FundProjectionScreenOutlined style={{fontSize: "20px"}}/>} />
      )}
    >
      {children}
    </ThemedLayout>
  )
}

export default Layout
