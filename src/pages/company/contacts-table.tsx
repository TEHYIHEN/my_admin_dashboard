import CustomAvatar from '@/components/custom-avatar';
import { ContactStatusTag } from '@/components/customUI/contact-status';
import { CustomFilterDropdown } from '@/components/customUI/CustomFilterDropdown';
import { Text } from '@/components/text';
import { statusOptions, statusOptionsTwo } from '@/constants';
import { COMPANY_CONTACTS_TABLE_QUERY } from '@/graphql/queries';
import { CompanyContactsTableQuery } from '@/graphql/types';
import { MailOutlined, PhoneOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/antd';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { Button, Card, Input, Select, Space, Table } from 'antd';
import React from 'react'
import { useParams } from "react-router-dom"

export const CompanyContactsTable = () => {

    const params = useParams<{id:string}>(); // or create a type RouteParams = {id: string}, then const params = useParams<RouteParams>();

    const {tableProps} = useTable<GetFieldsFromList<CompanyContactsTableQuery>>({

        resource:"contacts",
        syncWithLocation: false,
        sorters:{
            initial:[
                {
                    field:"createdAt",
                    order:"desc"
                }
            ]
        },
        filters:{
            initial:[
                {
                    field:"jobTitle",
                    value:"",
                    operator:"contains"
                },
                {
                    field:"name",
                    value:"",
                    operator:"contains"
                },
                {
                    field:"status",
                    value:undefined,
                    operator:"in" 
                    //use "eq" / "in" if there was enum
                    //if <Select mode="multiple"/> , then use "in"
                }, 
            ],

            permanent:[
                {
                    field:"company.id",
                    value:params?.id,
                    operator:"eq",
                },
            ],
        },

        meta:{
            gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
        },

    });


  return (
    <Card
        styles={{
            header:{
                borderBottom:"1px solid #D9D9D9",
                marginBottom:"1px"
            },
            body:{
                padding: 0,
            },
        }}
        title={
            <Space size={"middle"}>
                <TeamOutlined />
                <Text>Contacts</Text>
            </Space>
        }
        //Content to render in the top-right corner of the card
        extra={
            
            <>
                <Text type='secondary'>Total contacts:</Text>
                <Text strong style={{marginLeft: 10}}>
                    {/* && acts as a switch
                        if false,
                        switch closed and no display
                        if true,
                        switch open and display total
                    */}
                    {tableProps?.pagination !== false && tableProps.pagination?.total}
                </Text>
            </>
        }
    >

        <Table
            {...tableProps}
            rowKey={"id"}
            pagination={{
                ...tableProps.pagination,
                showSizeChanger: false, // hide the other pagination option, change to true and try
            }}
        >
            <Table.Column 
                title="Name"
                dataIndex={"name"}
                render= {(_ , record) => (

                    <Space>
                        <CustomAvatar name={record.name} src={record.avatarUrl} />
                        <Text
                            style={{whiteSpace:"nowrap"}}
                        >
                            {record.name}
                        </Text>
                    </Space>
                )}

                filterIcon= {<SearchOutlined />}
                filterDropdown={(props) => (
                    <CustomFilterDropdown {...props}>
                        <Input placeholder="Search name..."/>
                    </CustomFilterDropdown>
                )}
            />
            <Table.Column 
                title="Title"
                dataIndex={"jobTitle"}
                filterIcon= {<SearchOutlined />}
                filterDropdown={(props)=>(
                    <CustomFilterDropdown {...props}>
                        <Input placeholder='Search title'/>
                    </CustomFilterDropdown>
                )}
            />
            <Table.Column
                title="Stage"
                dataIndex={"status"}
                render={(_ , record)=> (<ContactStatusTag status={record.status} />)}
                // filterDropdown={(props) => (
                //     <CustomFilterDropdown {...props}>
                //         <Select
                //             style={{width:"200px"}}
                //             mode='multiple'
                //             placeholder='Select Stage'
                //             options={statusOptions}
                //         >
                //         </Select>
                //     </CustomFilterDropdown>
                // )}
                filters={statusOptionsTwo}
                filterSearch={true}
            />
            <Table.Column 
                dataIndex={"id"}
                width={112}
                render={(_ , record) => (
                    <Space>
                        <Button 
                            size='small'
                            href={`mailto:${record.email}`}
                            icon={<MailOutlined />}
                        />
                        <Button 
                            size='small'
                            href={`tel:${record.phone}`}
                            icon={<PhoneOutlined />}
                        />
                    </Space>
                )}
            />
        </Table>

    </Card>
  )
}
