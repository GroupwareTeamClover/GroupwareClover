export const baseUrl = () => {
    return 'http://192.168.1.5'; // replace with your backend server URL
}


// export const baseUrl = () => {
//     if (process.env.NODE_ENV === 'production') {
//         return 'https://api.production.com';
//     } else {
//         return 'http://localhost:8080';
//     }
// }

// 단순한 경우에는 상수, 복잡한 경우에는 함수. 함수는 호출될 때마다 실행되므로, 아주 미세하게 추가연산 필요.