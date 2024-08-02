import styles from './Pagination.module.css';
import React from 'react';
import ReactPaginate from 'react-paginate';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Pagination = ({ pageCount, onPageChange, currentPage }) => {
    return (
      <ReactPaginate
        previousLabel={<FiChevronLeft className={styles.pagination_arrow} />}
        nextLabel={<FiChevronRight className={styles.pagination__arrow} />}
        pageCount={pageCount}
        onPageChange={onPageChange}
        containerClassName={styles.pagination}
        pageLinkClassName={styles.pagination__link}
        activeLinkClassName={styles.pagination__link__active}
      />
    );
  };


    // <<< 페이지네이션 적용할 컴포넌트에 설정할 코드들 >>>
    //   //==========================================================================
    // const [currentPage, setCurrentPage] = useState(0);
    // // Pagingation
    // const PER_PAGE = 10; // 한 페이지에 보여줄 목록 수 
    // const pageCount = Math.ceil(filtered.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
    // console.log(pageCount + " 페이지 수 ")
    // const handlePageChange = ({selected}) =>{
    //     setCurrentPage(selected);
    //     window.scrollTo(0,320);     // 페이지 변경 시 스크롤 맨 위로 이동시키기. 
    // }
    // //==========================================================================
    //  {/* 페이지네이션  데이터 영역 */}
    //  {
    //   filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE)
    //   .map((mem,i)=>{
    //       return(
    // ------------------------------
    //  {/* 페이지네이션 */}
    //  {pageCount > 0 && (
    //   <Pagination
    //   pageCount={pageCount}
    //   onPageChange={handlePageChange}
    //   currentPage={currentPage}
    //   />
    //   )}