export const uploadImagesToS3 = async(FileSystem, uploadUrl) => {
    const formData = new FormData();

    for (let i = 0; i< files.length; i++) {
        formData.append('profileImage', files[i]);
    }

    const data = await response.json();

    if (!response.ok || data.status !== 201) {
        throw new Error(data.message || 'Lambda 이미지 업로드 실패');
    }

    return data.data.filePaths;
}