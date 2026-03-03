import CustomAvatar from '@/components/custom-avatar'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'
import { businessTypeOptions, companySizeOptions, industryOptions } from '@/constants'
import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutation'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import { UsersSelectQuery } from '@/graphql/types'
import { getNameInitials } from '@/utilities'
import { Edit, useForm, useSelect } from '@refinedev/antd'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { Col, Form, Input, InputNumber, InputNumberProps, Row, Select, Space } from 'antd'
import React from 'react'
import { CompanyContactsTable } from './contacts-table'

export const EditPage = () => {

    const { saveButtonProps, formProps, formLoading, query: formQuery } = useForm({ //同时用两个query会照成variable collision而报错，所以rename 成formQuery / selectQuery
        
        redirect:false,
        meta:{
            gqlMutation: UPDATE_COMPANY_MUTATION
        },
        
        
    });

    const {avatarUrl, name} = formQuery?.data?.data || {} ;

    const {selectProps, query: selectQuery} = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: "users",
        optionLabel:"name",
        pagination:{
          mode:"off",  //注意得关掉pagination, 不然其他user看不到
        },
        meta:{
          gqlQuery: USERS_SELECT_QUERY
        }
      }) 

    
    // const formatter: InputNumberProps<number>['formatter'] = (value) => {
    //   const [start, end] = `${value}`.split('.') || [];
    //   const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //   return `${end ? `${v}.${end}` : `${v}`}`;
    //   };

    

  return (
    <div>
      <Row gutter={[32,32]}>
        <Col xs={24} xl={12} >
            <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} breadcrumb={false} >
                <Form layout='vertical' {...formProps} >
                    <CustomAvatar 
                        shape='square' 
                        src={avatarUrl}
                        name={getNameInitials(name || '')}
                        style={{
                            width:96,
                            height:96,
                            marginBottom: "24px"
                            }}  
                      />
                       <Form.Item
                          label="Sales owner"
                          name="salesOwnerId"
                          initialValue={formProps?.initialValues?.salesOwnerId?.id}
                          //rules={[{required:true, message:"Sales owner name required"}]}
                        >
                          <Select 
                            placeholder="Please select a sales owner"
                            {...selectProps}  
                            options={
                            selectQuery.data?.data.map((user)=> ({

                                value: user.id,
                                label: (
                                  <SelectOptionWithAvatar
                                        name={user.name}
                                        avatarUrl={user.avatarUrl ?? undefined}
                        
                                  />
                                  )

                                })) ?? []
                              }      
                            />
                        </Form.Item>

                        <Form.Item>
                          <Select options={companySizeOptions}/>
                        </Form.Item>

                        <Form.Item >
                          <Space.Compact block>
                            <Space.Addon>$</Space.Addon>
                            <InputNumber 
                                autoFocus 
                                min={0} 
                                //defaultValue={0}
                                placeholder='0,00'
                                //formatter={formatter}
                                //parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                                style={{width: 200}}
                                controls={false} //关掉+与-的button
                            />
                          </Space.Compact>
                        </Form.Item>

                        <Form.Item label="Industry" >
                            <Select options={industryOptions}/>
                        </Form.Item>
                        <Form.Item label="Business type" >
                            <Select options={businessTypeOptions}/>
                        </Form.Item>
                        <Form.Item label="Country" name={"country"}>
                            <Input placeholder='Country'/>
                        </Form.Item>
                        <Form.Item label="Website" name={"website"}>
                            <Input placeholder='Website'/>
                        </Form.Item>

                </Form>
            </Edit>
        </Col>
        <Col xs={24} xl={12}>
            <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  )
}


