import ProfileComponent from "../components/profile/profile.component";
import { UserTanstack } from "../utils/tanstack/user.tanstack";


export default function ProfilePage () {
    
    const {data, isPending, isError} = UserTanstack.getUser();
    const {mutate : changeNameMutate, isPending : isChangeNamePending} = UserTanstack.changeName();
    const {mutate : logoutMutate, isPending : logOutPending} = UserTanstack.logOut();
    const {mutate : changePassMutate, isPending : changePassPending} = UserTanstack.changePassWord();
    const {mutate : changeAvatarMutate, isPending : isChangeAvtPending } = UserTanstack.changeAvatar()

    const handleClickChangeName = (newName : string)=> {
        changeNameMutate(newName);
    }

    const handleClickChangePass = (oldPass: string, newPass: string) => {
        changePassMutate({oldPass, newPass});
    }

    const handleClickLogout = ()=> {
        logoutMutate();
    }

    const handleChangeAvatar = (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file)
            changeAvatarMutate(formData)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitAndRegainPass = () => {

    }

    if (isError) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Lỗi khi tải thông tin người dùng </div>
    }

    return (
        <div className="main_layout_profile">
            <ProfileComponent user={data} onChangeName={handleClickChangeName} onChangePass={handleClickChangePass} onLogout={handleClickLogout} onChangeAvatar={handleChangeAvatar} isUploading={isChangeAvtPending} onSubmitOtpAndRegainPassword={handleSubmitAndRegainPass}/>
        </div>
    )
}