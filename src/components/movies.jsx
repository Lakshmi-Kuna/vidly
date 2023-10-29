import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import _ from "lodash";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviestable";
import { Link } from "react-router-dom";
import SearchBox from "./common/searchBox";
// import { genres } from "./../services/fakeGenreService";
import { getGenres } from "./../services/genreService";
import { toast } from "react-toastify";
import { formToJSON } from "axios";
class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,

    genres: [],
    sortColumn: { path: "title", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];
    // const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  handleDelete = async (item) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== item._id);
    this.setState({ movies });
    // await delete item._id;

    try {
      await deleteMovie(item._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };
  handleLiked = (item) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(item);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
    // console.log("like clicked", item);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    // console.log(page);
  };
  handleGenreSelect = (genre) => {
    // console.log(genre);
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      searchQuery,
      movies: allmovies,
      sortColumn,
    } = this.state;

    //   const filtered =
    //     selectedGenre && selectedGenre._id
    //       ? allmovies.filter((m) => m.genre._id === selectedGenre._id)
    //       : allmovies;
    //   const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    //   const movies = paginate(sorted, currentPage, pageSize);
    //   return { totalCount: filtered.length, data: movies };
    // };
    let filtered = allmovies;
    if (searchQuery)
      filtered = allmovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allmovies.filter((m) => m.genre._id === selectedGenre._id);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { user } = this.props;

    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      // selectedGenre,
      // movies: allmovies,
      sortColumn,
    } = this.state;

    if (count === 0) return <p>There are no moies in the database</p>;
    const { totalCount, data: movies } = this.getPagedData();
    return (
      <div className="row mt-3 container">
        <div className="col-2">
          <ListGroup
            selectedItem={this.state.selectedGenre}
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col-3">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies in the database</p>
          <SearchBox
            onChange={this.handleSearch}
            value={this.state.searchQuery}
          />
          <MoviesTable
            movies={movies}
            onLike={this.handleLiked}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}
ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};
export default Movies;
