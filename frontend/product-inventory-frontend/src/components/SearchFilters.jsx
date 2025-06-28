import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { categoryService } from '../services/categoryService';
import { debounce } from '../utils/helpers';
import toast from 'react-hot-toast';

const SearchFilters = ({ 
    onSearch, 
    onFilterChange, 
    initialFilters = {} 
}) => {
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [selectedCategories, setSelectedCategories] = useState(initialFilters.categoryIds || []);
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Debounced search function
    const debouncedSearch = debounce((term) => {
        onSearch(term);
    }, 300);

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Handle search term changes
    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm]);

    // Handle filter changes
    useEffect(() => {
        onFilterChange({
            search: searchTerm,
            categoryIds: selectedCategories
        });
    }, [selectedCategories]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await categoryService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        onSearch('');
        onFilterChange({
            search: '',
            categoryIds: []
        });
    };

    const getSelectedCategoryNames = () => {
        return categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(cat => cat.name);
    };

    const hasActiveFilters = searchTerm || selectedCategories.length > 0;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4"
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        {selectedCategories.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {selectedCategories.length}
                            </Badge>
                        )}
                    </Button>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearAllFilters}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Search: "{searchTerm}"
                            <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setSearchTerm('')}
                            />
                        </Badge>
                    )}
                    {getSelectedCategoryNames().map(name => (
                        <Badge key={name} variant="outline" className="flex items-center gap-1">
                            {name}
                            <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => {
                                    const category = categories.find(cat => cat.name === name);
                                    if (category) handleCategoryToggle(category.id);
                                }}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Filter Panel */}
            {showFilters && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">Filter by Categories</h3>
                            
                            {loadingCategories ? (
                                <div className="text-center py-4 text-gray-500">
                                    Loading categories...
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    No categories available
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                    {categories.map(category => (
                                        <Badge
                                            key={category.id}
                                            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-blue-100 justify-center py-2"
                                            onClick={() => handleCategoryToggle(category.id)}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchFilters;

