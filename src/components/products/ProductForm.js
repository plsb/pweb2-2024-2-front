import React, { useState, useEffect } from 'react'; // Adicionamos o useEffect
import {
    Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import api from '../../services/api';

const ProductForm = ({ open, onClose, categories, mode, currentProduct, fetchProducts }) => {
    const [product, setProduct] = useState({ name: '', categoryId: '', price: '' });

    // Atualiza o estado `product` quando `currentProduct` mudar
    useEffect(() => {
        if (mode === 'edit' && currentProduct) {
            setProduct(currentProduct);
        } else {
            setProduct({ name: '', categoryId: '', price: '' }); // Reseta o formulário no modo de criação
        }
    }, [currentProduct, mode]);

    const handleCreateProduct = async () => {
        try {
            await api.post('/products', { ...product, price: parseFloat(product.price) });
            setProduct({ name: '', categoryId: '', price: '' });
            onClose();
            fetchProducts();
        } catch (error) {
            console.error('Erro ao criar produto:', error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await api.put(`/products/${product.id}`, { ...product, price: parseFloat(product.price) });
            onClose();
            fetchProducts();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" mb={2}>
                    {mode === 'create' ? 'Criar Novo Produto' : 'Editar Produto'}
                </Typography>
                <TextField
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        value={product.categoryId}
                        onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                        label="Categoria"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.description}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Preço"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={mode === 'create' ? handleCreateProduct : handleUpdateProduct}
                >
                    {mode === 'create' ? 'Salvar' : 'Atualizar'}
                </Button>
            </Box>
        </Modal>
    );
};

export default ProductForm;