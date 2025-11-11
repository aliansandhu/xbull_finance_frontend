import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {userVerify} from "../../apis/Authentication/verifyAccount";
import icon from '../../assets/images/updatedLogo.png'

const EmailVerified = () => {

    const params = useParams()
    const navigate = useNavigate();

    useEffect( () => {
        async function verify() {
            const response = await userVerify(params.uuid)

            if(response.data.success === true){
                setTimeout(() => {
                    navigate('/login')
                },3000)
            }

        }
        verify()
    },[params.uuid])

    return(
        <div className="h-screen bg-blue-950 flex items-center justify-center">
            <div className={'justify-center items-center'}>
                <img src={icon} alt={''} width={'450'} className={'ml-[-30px] mb-10'}/>
                <p className={'text-white text-center text-36'}>Email Verified</p>
            </div>
        </div>
    )
}

export default EmailVerified