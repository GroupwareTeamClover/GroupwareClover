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