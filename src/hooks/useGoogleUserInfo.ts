import { useEffect,useState } from "react";
export type UserInfo ={
  sub:string,
  name:string,
  given_name:string,
  picture:string,
  email:string,
  email_verified:boolean,
  locale:string,
}
const useGoogleUserInfo = (access_token:string,
    unathorizeCallback = (message:string)=>{console.error(message)}) => {
    const [userData,setUserData] = useState<UserInfo>({} as UserInfo);
    useEffect(() => {
        console.log('useGoogleUserInfo',access_token)
        
        if (!access_token) {
          setUserData({} as UserInfo);
          return
        }
        const fetchUserData = async () => {
          fetch('https://www.googleapis.com/oauth2/v3/userinfo',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          }).then(async (response) => {
            if (!response.ok) {
              unathorizeCallback('Unauthorized with token: ' + access_token);
              return;
            }
            const userData = await response.json();
            setUserData(userData);
          }).
          catch((error) => {
            console.error('Error fetching user data:', error);
          });
        }
        fetchUserData();
      },[access_token]);
    return userData;
}
export default useGoogleUserInfo;
    