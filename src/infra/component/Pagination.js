// @flow
import React from 'react';

class Pagination extends React.Component {

  state: {
    page: number,
    perPage: number,
  }

  props: {
    list: Object[],
    ChildNode: any,
  }

  goToPage: Function

  constructor(props: Object) {
    super(props);

    this.goToPage = this.goToPage.bind(this);

    this.state = {
      page: 1,
      perPage: 10,
    };
  }

  goToPage(page: number) {
    return (e: Event) => {
      e.preventDefault();
      this.setState({ page });
    }
  }

  render() {
    const { list, ChildNode } = this.props;
    const { page, perPage } = this.state;

    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    const currentList = list.slice(start, end);

    const totalPage = Math.ceil(list.length / perPage)
    const max = 3;
    const startPage: number = page - max <= 1 ? 1 : page - max;
    const endPage: number = page + max >= totalPage ? totalPage : page + max;
    const allPages = [];
    for (let x = startPage; x <= endPage; x++) {
      allPages.push(x);
    }

    const pages = [
      (<li className={page <= 1 ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="Previous" onClick={this.goToPage(page - 1)}>
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </a>
      </li>),
      ...allPages.map(pg => <li className={page === pg ? 'active page-item' : 'page-item'}><a className="page-link" href="#" onClick={this.goToPage(pg)} >{pg}</a></li>),
      (<li className={page >= totalPage ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" href="#" aria-label="Next" onClick={this.goToPage(page + 1)}>
          <span aria-hidden="true">»</span>
          <span className="sr-only">Next</span>
        </a>
      </li>)
    ];

    const pagination = (
      <nav>
        <ul className="pagination" style={{ float: 'right' }}>
          {pages.map((page, key) => page)}
        </ul>
      </nav>
    );

    return (
      <div className="row">
        <div className="col-12">
          {currentList.map((props, key) => <ChildNode key={key} {...props} />)}
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-block">
              <div className="row">
                <div className="col-md-6">
                  Page {page} of {totalPage}, per page {perPage}
                </div>
                <div className="col-md-6">
                  {pagination}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Pagination;
