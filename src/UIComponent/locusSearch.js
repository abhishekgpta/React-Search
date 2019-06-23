import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchComponent from '../searchComponent/searchComponent';

const dataSet=[
  {
    "id": "123-s2-546",
    "name": "John Jacobs",
    "items": ["bucket", "bottle"],
    "address": "1st Cross, 9th Main, abc Apartment",
    "pincode": "5xx012"
  },
  {
    "id": "123-s3-146",
    "name": "David Mire",
    "items": ["Bedroom Set"],
    "address": "2nd Cross, BTI Apartment",
    "pincode": "4xx012"
  },
  {
    "id": "223-a1-234",
    "name": "Soloman Marshall",
    "items": ["bottle"],
    "address": "Riverbed Apartment",
    "pincode": "4xx032"
  },
  {
    "id": "121-s2-111",
    "name": "Ricky Beno",
    "items": ["Mobile Set"],
    "address": "Sunshine City",
    "pincode": "5xx072"
  },
  {
    "id": "123-p2-246",
    "name": "Sikander Singh",
    "items": ["Air Conditioner"],
    "address": "Riverbed Apartment",
    "pincode": "4xx032"
  },
  {
    "id": "b23-s2-321",
    "name": "Ross Wheeler",
    "items": ["Mobile"],
    "address": "1st Cross, 9th Main, abc Apartement",
    "pincode": "5xx012"
  },
  {
    "id": "113-n2-563",
    "name": "Ben Bish",
    "items": ["Kitchen Set", "Chair"],
    "address": "Sunshine City",
    "pincode": "5xx072"
  },
  {
    "id": "323-s2-112",
    "name": "John Michael",
    "items": ["Refrigerator"],
    "address": "1st Cross, 9th Main, abc Apartement",
    "pincode": "5xx012"
  },
  {
    "id": "abc-34-122",
    "name": "Jason Jordan",
    "items": ["Mobile"],
    "address": "Riverbed Apartment",
    "pincode": "4xx032"
  }
]

const getSuggestions = value => {
	  const inputValue = value.trim().toLowerCase();
	  const inputLength = inputValue.length;

	  let updatedValue= inputLength === 0 ? [] : dataSet.filter(data =>
	    data.name.toLowerCase().slice(0, inputLength) === inputValue || data.address.toLowerCase().includes(inputValue) 
	    || data.pincode.toLowerCase().includes(inputValue) || data.id.toLowerCase().includes(inputValue) 
	  );
	  return updatedValue.length>0?updatedValue:inputLength>0?["No data found"]:[];
	};	
  const getSuggestionValue = suggestion => `${suggestion.id};${suggestion.name};${suggestion.address};${suggestion.pincode}`;
 
export default class LocusSearch extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: '',
			suggestions:getSuggestions('')
		}
	}
	
	onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  	};
   onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };
	render(){
		const { value, suggestions } = this.state;
		const inputProps = {
	      placeholder: "Search users by ID, address,name, pincode and itemlist",
	      value,
	      onChange: this.onChange
	    };
		return <div className="container">
		<SearchComponent
		suggestions={suggestions}
		id="locussSearch"
	    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
	    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
	    getSuggestionValue={getSuggestionValue}
	    inputProps={inputProps}
	    />
		</div>
	}
}