// @flow
import React from 'react';

class Pagination extends React.Component {

  state: {
    page: number,
  }

  props: {
    list: Object[],
    ChildNode: any,
    perPage?: number,
    hideNavigationOnSinglePage?: boolean,
  }

  goToPage: Function

  constructor(props: Object) {
    super(props);

    this.goToPage = this.goToPage.bind(this);

    this.state = {
      page: 1,
    };
  }

  goToPage(page: number) {
    return (e: Event) => {
      e.preventDefault();
      this.setState({ page });
    }
  }

  render() {
    const { list, ChildNode, hideNavigationOnSinglePage, perPage } = this.props;
    const { page } = this.state;

    // handle default props
    const fixPerPage = perPage || 10;

    // handle list
    const start = (page - 1) * fixPerPage;
    const end = start + fixPerPage;
    const currentList = list.slice(start, end);

    // handle pagination details
    const totalPage = Math.ceil(list.length / fixPerPage);
    const max = 3;
    const startPage: number = page - max <= 1 ? 1 : page - max;
    const endPage: number = page + max >= totalPage ? totalPage : page + max;
    const allPages = [];
    for (let x = startPage; x <= endPage; x++) {
      allPages.push(x);
    }

    // available pages
    const pages = [
      (<li key="first" className={page <= 1 ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="First" onClick={this.goToPage(1)}>
          <span aria-hidden="true">««</span>
          <span className="sr-only">First</span>
        </a>
      </li>),
      (<li key="prev" className={page <= 1 ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="Previous" onClick={this.goToPage(page - 1)}>
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </a>
      </li>),
      ...allPages.map((pg, key) => <li key={key} className={page === pg ? 'active page-item' : 'page-item'}><a className="page-link" href="#" onClick={this.goToPage(pg)} >{pg}</a></li>),
      (<li key="next" className={page >= totalPage ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="Next" onClick={this.goToPage(page + 1)}>
          <span aria-hidden="true">»</span>
          <span className="sr-only">Next</span>
        </a>
      </li>),
      (<li key="last" className={page >= totalPage ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="Last" onClick={this.goToPage(totalPage)}>
          <span aria-hidden="true">»»</span>
          <span className="sr-only">Last</span>
        </a>
      </li>),
    ];

    const pagination = (
      <nav>
        <ul className="pagination" style={{ float: 'right' }}>
          {pages.map((page, key) => page)}
        </ul>
      </nav>
    );

    const navigation = hideNavigationOnSinglePage && totalPage === 1 ? '' : (
      <div className="col-12">
        <div className="row">
          <div className="col-md-6" style={{ lineHeight: 3 }}>
            Page {page} of {totalPage}. Item {start + 1} to {end}.
          </div>
          <div className="col-md-6">
            {pagination}
          </div>
        </div>
      </div>
    );

    return (
      <div className="row">
        <div className="col-12">
          {currentList.map((props, key) => <ChildNode key={key} {...props} />)}
        </div>
        {navigation}
      </div>
    );
  }

}

export default Pagination;
