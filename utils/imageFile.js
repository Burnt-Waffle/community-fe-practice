export const uploadImagesToS3 = async (files, uploadUrl) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('profileImage', files[i]);
    }

    const response = await authFetch(uploadUrl, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.status !== 201) {
        throw new Error(data.message || 'Lambda 이미지 업로드 실패');
    }

    return data.data.filePaths;
}