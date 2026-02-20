import { GraphQLFormattedError } from "graphql";

type CustomError = {
    message: string;
    statusCode: string;
}


const customFetch = async(url:RequestInfo | URL, options?:RequestInit) => {

    const accessToken = localStorage.getItem('access_token');

    const headers = options?.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Prefetch": "true",
        }
    })

    
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): CustomError | null => {

    if(!body) {

        return {

            message:"Unknown error",
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if("errors" in body) {

        const errors = body?.errors;

        const messages = errors?.map((error) => error?.message)?.join(",");
        const code = errors?.[0]?.extensions?.code;
       

        return{
            message: messages || JSON.stringify(errors),
            statusCode: String(code || 500)
        }
        
    }

    return null;

}

export const fetchWrapper = async(url:RequestInfo| URL , options?:RequestInit) => {

    const response = await customFetch(url, options);

    const responseClone = response.clone();

    try{
        const body = await responseClone.json();

        const error = getGraphQLErrors(body);

        if(error) {

            throw error;
        }
    }catch(error) {

        if(!response.ok) {
            throw {
            message: response.statusText,
            statusCode: String(response.status)
        }
    } 
    }

    return response;
}