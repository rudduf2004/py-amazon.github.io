function setRating(rating) {
  const stars = document.querySelectorAll(".star"); // 모든 별 요소 선택
  stars.forEach((star, index) => {
    star.classList.remove("half");
    star.classList.remove("filled");
    // rating이 1 이상일 때는 전체 채우기, 0.5면 반 채우기
    if (rating >= index + 1) {
      star.classList.add("filled"); // 채워진 별
    } else if (rating > index && rating < index + 1) {
      star.classList.add("half"); // 채워진 별
    }
  });
}

// 별점 설정 예제
const rating = "2"; // 0.0 ~ 5.0 값 설정
setRating(rating);
