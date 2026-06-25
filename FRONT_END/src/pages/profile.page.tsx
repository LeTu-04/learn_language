// import ProfileComponent from "../components/profile/profile.component";
// import { UserTanstack } from "../utils/tanstack/user.tanstack";


// export default function ProfilePage () {

//     const {data, isPending, isError} = UserTanstack.getUser();
//     const {mutate : changeNameMutate, isPending : isChangeNamePending} = UserTanstack.changeName();
//     const {mutate : logoutMutate, isPending : logOutPending} = UserTanstack.logOut();
//     const {mutate : changePassMutate, isPending : changePassPending} = UserTanstack.changePassWord();
//     const {mutate : changeAvatarMutate, isPending : isChangeAvtPending } = UserTanstack.changeAvatar()

//     const handleClickChangeName = (newName : string)=> {
//         changeNameMutate(newName);
//     }

//     const handleClickChangePass = (oldPass: string, newPass: string) => {
//         changePassMutate({oldPass, newPass});
//     }

//     const handleClickLogout = ()=> {
//         logoutMutate();
//     }

//     const handleChangeAvatar = (file: File) => {
//         try {
//             const formData = new FormData();
//             formData.append('file', file)
//             changeAvatarMutate(formData)
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleSubmitAndRegainPass = () => {

//     }

//     if (isError) {
//         return <div style={{textAlign: 'center', marginTop: '50px'}}>Lỗi khi tải thông tin người dùng </div>
//     }

//     return (
//         <div className="main_layout_profile">
//             <ProfileComponent user={data} onChangeName={handleClickChangeName} onChangePass={handleClickChangePass} onLogout={handleClickLogout} onChangeAvatar={handleChangeAvatar} isUploading={isChangeAvtPending} onSubmitOtpAndRegainPassword={handleSubmitAndRegainPass}/>
//         </div>
//     )
// }


import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileComponent from "../components/profile/profile.component";
import SettingsComponent from "../components/settings/settings.component";
import OtpPopup from "../components/popup/otp_popup";
import { UserTanstack } from "../utils/tanstack/user.tanstack";
import { CateTanStack } from "../utils/tanstack/category.tanstack";
import PostComponent from "../components/common/post/post.component";

export default function ProfilePage() {

    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'profile';
    const isSetting = tab !== 'profile';

    const { data, isPending, isError } = UserTanstack.getUser();
    const { mutate: changeNameMutate } = UserTanstack.changeName();
    const { mutate: logoutMutate } = UserTanstack.logOut();
    const { mutate: changePassMutate } = UserTanstack.changePassWord();
    const { mutate: changeAvatarMutate, isPending: isChangeAvtPending } = UserTanstack.changeAvatar();
    const { mutate: requireOtpMutate } = UserTanstack.requireOtpRegain();

    const {data : postData, isPending : isPostDataPending} = UserTanstack.getMyPost(tab === 'profile');


    const { data: trashCategories } = CateTanStack.getCateDeleted(tab === 'trash');


    const [isOtpOn, setIsOtpOn] = useState<boolean>(false);

    const handleClickChangeName = (newName: string) => {
        changeNameMutate(newName);
    };

    const handleClickChangePass = (oldPass: string, newPass: string) => {
        changePassMutate({ oldPass, newPass });
    };

    const handleClickLogout = () => {
        logoutMutate();
    };

    const handleChangeAvatar = (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            changeAvatarMutate(formData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRequireOtp = () => {
        if (data?.email) {
            setIsOtpOn(true);
            requireOtpMutate(data.email);
        }
    };

    if (isError) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Lỗi khi tải thông tin người dùng</div>;
    }

    return (
        <div className="main_layout_profile">
            {/*OTP Popup tại đây */}
            {isOtpOn && data && (
                <OtpPopup
                    type="regain"
                    email={data.email}
                    handleClickTurnOffOtp={() => setIsOtpOn(false)}
                />
            )}

            <ProfileComponent
                isSetting={isSetting}
                user={data}
                onChangeAvatar={handleChangeAvatar}
                isUploading={isChangeAvtPending}            >

                {tab === 'profile' ? (
                    (isPostDataPending ? <div className="">
                        <p>Đang tải bài viết</p>
                    </div> :  <PostComponent posts={postData.posts} avatarUrl={postData.avatarUrl} name={postData.name}/>)
                ) : (
                    <SettingsComponent
                        typeSetting={tab as 'settings' | 'trash' | 'history'}
                        onChangeName={handleClickChangeName}
                        onChangePass={handleClickChangePass}
                        onLogout={handleClickLogout}
                        onRegainPassword={handleRequireOtp}
                        trashCategories={trashCategories || []}
                    />
                )}
            </ProfileComponent>
        </div>
    );
}
