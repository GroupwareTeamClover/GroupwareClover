export const BaseUrl = () => {
    return process.env.REACT_APP_API_URL;   
}
if(!BaseUrl) throw new Error('REACT_APP_API_URL가 없음');

// export const baseUrl = () => {
//     if (process.env.NODE_ENV === 'production') {
//         return 'https://api.production.com';
//     } else {
//         return 'http://localhost:8080';
//     }
// }

// export const BaseUrl = process.env.REACT_APP_API_URL;

// 단순한 경우에는 상수, 복잡한 경우에는 함수. 함수는 호출될 때마다 실행되므로, 아주 미세하게 추가연산 필요.


// -------------------------------- env 설정 --------------------------------
// root 폴더에 있는 env 파일 안 REACT_APP_BASE_URL 설정을 불러오는 명령어.
// env_example 파일 작성 예정

// frontend 최상단 package.json 있는 구역에서 .env 파일 생성 후 
// REACT_APP_BASE_URL = http://192.168.45.61(본인 아이피) 생성해놓으면 됨.
