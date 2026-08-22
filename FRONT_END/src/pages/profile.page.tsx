

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileComponent from "../components/profile/profile.component";
import SettingsComponent from "../components/settings/settings.component";
import OtpPopup from "../components/popup/otp_popup";
import { UserTanstack } from "../utils/tanstack/user.tanstack";
import { CateTanStack } from "../utils/tanstack/category.tanstack";
import PostComponent from "../components/common/post/post.component";
import PostModalComponent from "../components/common/post_modal/post_modal";

export default function ProfilePage() {

    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'profile';
    const isSetting = tab !== 'profile';
    const [isActiveCommentList, setActiveCommentList] = useState<number | null>(null);

    const { data, isPending, isError } = UserTanstack.getUser();
    const { mutate: changeNameMutate } = UserTanstack.changeName();
    const { mutate: logoutMutate } = UserTanstack.logOut();
    const { mutate: changePassMutate } = UserTanstack.changePassWord();
    const { mutate: changeAvatarMutate, isPending: isChangeAvtPending } = UserTanstack.changeAvatar();
    const { mutate: requireOtpMutate } = UserTanstack.requireOtpRegain();

    const { data: postData, isPending: isPostDataPending } = UserTanstack.getMyPost(tab === 'profile');
    const { data: myPostCommentData } = UserTanstack.getCommentMyPost(isActiveCommentList || 0, !!isActiveCommentList)
    const { data: trashCategories } = CateTanStack.getCateDeleted(tab === 'trash');

    const { mutate: deletePermMutate, isPending: deletePermCatePending } = CateTanStack.deletePermCate();
    const { mutate: restoreMutate, isPending: restorePending } = CateTanStack.restoreCate();
    const { mutate: likePostMutate } = UserTanstack.likePost();
    const { mutate: createCommentMutate } = UserTanstack.createComment()

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
            console.error(error);
        }
    };

    const handleRestoreCate = (categoryId: number) => {
        restoreMutate(categoryId)
    }

    const handleDeletePerCate = (categoryId: number) => {
        deletePermMutate(categoryId)
    }

    const handleRequireOtp = () => {
        if (data?.email) {
            setIsOtpOn(true);
            requireOtpMutate(data.email);
        }
    };

    const handleOnLike = (postId: number) => {
        likePostMutate(postId);
    }

    const handleCommentClick = (postId: number) => {
        if (isActiveCommentList !== null) {
            setActiveCommentList(null);
        } else {
            setActiveCommentList(postId);
        }


    }

    const handlePostComment = (postId: number, content: string) => {
        createCommentMutate({ postId, content })
    }

    if (isError) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Lỗi khi tải thông tin người dùng</div>;
    }

    return (
        <div className="main_layout_profile">
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
                    </div> : <PostComponent posts={postData.posts} avatarUrl={postData.avatarUrl} name={postData.name} onLike={handleOnLike} onCommentClick={handleCommentClick} />)
                ) : (
                    <SettingsComponent
                        typeSetting={tab as 'settings' | 'trash' | 'history'}
                        onChangeName={handleClickChangeName}
                        onChangePass={handleClickChangePass}
                        onLogout={handleClickLogout}
                        onRegainPassword={handleRequireOtp}
                        trashCategories={trashCategories || []}
                        onRestoreCate={handleRestoreCate}
                        onDeletePerCate={handleDeletePerCate}
                    />
                )}
            </ProfileComponent>

            {isActiveCommentList !== null && postData?.posts.find((p: any) => p.id === isActiveCommentList) && (
                <PostModalComponent 
                    post={postData.posts.find((p: any) => p.id === isActiveCommentList)} 
                    comments={myPostCommentData || []} 
                    avatarPrimaryUser={data?.avatarUrl || undefined} 
                    onClose={() => setActiveCommentList(null)} 
                    onLike={handleOnLike} 
                    name={postData.name}
                    onPostComment={handlePostComment} 
                    
                />
            )}
        </div>


    );
}
