import { apiGetUsers } from "./api/apiGetUsers"
import { apiPostUsers } from "./api/apiPostUsers"
import { useApiRequest } from "./hooks/useApiRequest"
import { UserPresentation } from "./users.presentation"

export type UsersProps = {

}

export const Users: React.FC<UsersProps> = (_props) => {
    const { callApi: callApiGetUsers, response: getUsersResponse } = useApiRequest({
        fetchFunction: apiGetUsers
    });
    const { callApi: callApiPostUsers, response: postUsersResponse } = useApiRequest({
        fetchFunction: apiPostUsers
    });
    const handleButtonClick = () => {
        callApiGetUsers({})
        callApiPostUsers({ body: { username: "New User" } })
    }
    return (<UserPresentation buttonOnClick={handleButtonClick} />)
}
