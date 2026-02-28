import CustomAvatar from "@/components/custom-avatar";
import { CustomFilterDropdown } from "@/components/customUI/CustomFilterDropdown";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { currencyNumber } from "@/utilities";
import { SearchOutlined } from "@ant-design/icons";
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from "@refinedev/antd"
import { getDefaultFilter, useGo } from "@refinedev/core"
import { Input, Space, Table } from "antd";
import React from "react";




export const CompanyList = ({children}: React.PropsWithChildren) => {

  const go = useGo();

  const { tableProps, filters, searchFormProps} = useTable({

    resource:"companies",
    pagination:{
      pageSize:10,
    },
    meta:{
      gqlQuery: COMPANIES_LIST_QUERY
    },
    sorters:{
      initial: [
        {
          field: "createdAt",
          order: "desc"
        }
      ]
    },
    filters:{
      initial:[
        {
          field:"name",
          operator:"contains",
          value: undefined
        }
      ]
    },
    //  filters:{
    //   initial:[
    //     {
    //       operator:"or", 
    //       value:[
    //         {//优先过滤第一层
    //           field:"name",
    //           operator:"eq",
    //           value: undefined
    //         },
    //         {//然后过滤第二层
    //           field:"name",
    //           operator:"contains",
    //           value: undefined
    //         },

    //     ]
    //     }
    //   ]
    // },
    onSearch: (values:{name?:string}) => {

      return [
        {
          field: "name",
          operator: "contains",
          value: values.name ?? undefined,
        }
      ]
    },
    // onSearch: (values:{name?:string}) => {

    //   const searchTerm = values.name ?? undefined;
      

    //   if(!searchTerm){
    //     return []
    //   }

    //   return [
    //     {
    //      operator: "or",
    //      value: [
    //       {
    //         field: "name",
    //         operator: "eq",
    //         value: searchTerm,
    //       },
    //       {
    //         field: "name",
    //         operator: "contains",
    //         value: searchTerm,
    //       },
    //      ]
    //     }
    //   ]
    // },
    syncWithLocation: true,
    
    

  })

  //console.log(tableProps);

  return (
    <div>
      <List
        breadcrumb={false}
        headerButtons={() => (

              <CreateButton 
                  onClick={() => {
                    go({
                      to: {
                        resource: "companies",
                        action: "create",
                      },
                      options: {
                        keepQuery: true,
                      },
                      type: "replace"
                    })
                  }}
              />
        )}
      >
        <Table
          {...tableProps}
          pagination={
            {...tableProps.pagination,
              showTotal(total, range) {
                return `${range[0]}-${range[1]} of ${total}`;
              },
            }} //use it when need to change it style/size/...  to keep default logic(curremt, pageSize, onChange)
        >
          {/* Company Title */}
          <Table.Column  //if red line error, put <Company> for typesafe
            title="Company Title"
            dataIndex={"name"}
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props)=> (

                <CustomFilterDropdown {...props}>
                    <Input 
                       // {...props}
                        placeholder="Seach Company..."
                        onPressEnter={()=> props.confirm()}
                        //value={props.selectedKeys[0]}
                        //onChange={(e) => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        
                    />
                </CustomFilterDropdown>
            )}
            render={(_, record) => (

                <Space>
                  <CustomAvatar shape="square" name={record.name} src={record.avatarUrl} />
                  <Text>
                    {record.name}
                  </Text>
                </Space>

            )}

          />

             {/* Revenue */}
            <Table.Column 
              title="Deals Amount"
              //no need dataIndex, 因为数据不在第一层，查看console.log(tableProps)
              render={(_, company) => (

                <Text>
                  {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
                </Text>

              )}

            />

              {/* Edit or Delete */}
            <Table.Column 
              title="Actions"
              dataIndex={"id"}
              fixed="right"
              render={(value) => (

                <Space>
                  <EditButton hideText size="small" recordItemId={value} />
                  <DeleteButton hideText size="small" recordItemId={value} />
                </Space>

              )}

            />
        </Table>

      </List>
      {children}
    </div>
    
  )
}

