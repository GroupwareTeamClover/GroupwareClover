// root 폴더에 있는 env 파일 안 REACT_APP_BASE_URL 설정을 불러오는 명령어.
// env_example 파일 작성 예정
export const BaseUrl = () => {
    return 'http://192.168.1.14';   
}

// export const BaseUrl = process.env.REACT_APP_API_URL;

if(!BaseUrl) throw new Error('REACT_APP_BASE_URL가 없음');



// export const baseUrl = () => {
//     return 'http://192.168.1.5'; // replace with your backend server URL
// }
// frontend 최상단package.json 있는 구역에서 .env 파일 생성 후 
// REACT_APP_BASE_URL = http://192.168.45.61(본인 아이피) 생성해놓으면 됨.
