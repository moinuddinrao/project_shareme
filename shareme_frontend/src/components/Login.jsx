import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();
    const createOrGetuser = async (response) => {
        const decoded = jwt_decode(response.credential)
        localStorage.setItem('user', JSON.stringify(decoded))
        const { name, picture, sub } = decoded;
        const doc = {
            _id: sub,
            _type: 'user',
            userName: name,
            image: picture,
        }

        client.createIfNotExists(doc)
            .then(() => {
                navigate('/', { replace: true })
            })
    }
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
            <div className='flex justify-start items-center flex-col h-screen'>
                <div className='relative w-full h-full'>
                    <video
                        src={shareVideo}
                        type="video/mp4"
                        loop
                        controls={false}
                        muted
                        autoPlay
                        className="h-full w-full object-cover"
                    />
                    <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                        <div className='p-5'>
                            <img src={logo} width="130px" alt='logo' />
                        </div>
                        <div className='shadow-2xl'>
                            <GoogleLogin
                                render={(renderProps) => (
                                    <button
                                        type="button"
                                        className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                    >
                                        <FcGoogle className="mr-4" /> Sign in with google
                                    </button>
                                )}
                                onSuccess={(response) => createOrGetuser(response)}
                                onError={() => console.log('Error')}
                                cookiePolicy="single_host_origin"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default Login