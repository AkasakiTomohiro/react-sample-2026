import type { apiGetUsers } from "./api/apiGetUsers"
import type { GetApiRequestResponseType } from "./hooks/useApiRequest"

export type UserPresentationProps = {
    buttonOnClick?: () => void
}
export const UserPresentation: React.FC<UserPresentationProps> = (props) => {
    return (
        <div>
            User Presentation
            <button onClick={props.buttonOnClick}>Click me</button>
            <CommonErrorResponse response={null}>
                <GetUserErrorResponse response={null} />
            </CommonErrorResponse>
        </div>
    )
}
export const CommonErrorResponse: React.FC<{response: GetApiRequestResponseType<typeof apiGetUsers> | null, children?: React.ReactNode}> = (props) => {
    if (props.response === null) {
        return <></>
    }
    if(props.response.success) {
        // FETCH_ERROR, RESPONSE_ERROR, INTERNAL_ERROR の場合は共通のエラー表示を行う
        return <></>
    }
    if(props.response.success) {
        // API Gateway Error Responses
        return <></>
    }
    return(
        <>
         {props.children}
        </>
    )
}
export const GetUserErrorResponse: React.FC<{response: GetApiRequestResponseType<typeof apiGetUsers> | null}> = (props) => {
    if (props.response === null) {
        return <></>
    }
    if(props.response.success) {
        return <></>
    }
    return(
        <>
         // ダイアログ表示
        </>
    )
}
