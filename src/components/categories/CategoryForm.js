import React, { useState } from 'react';
import {
    Box, Button, TextField, Modal, Typography
} from '@mui/material';

const CategoryForm = ({ open, onClose, onSubmit, initialData, isEdit }) => {
    const [category, setCategory] = useState(initialData || { description: '' });

    const handleChange = (e) => {
        setCategory({ ...category, description: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(category);
        onClose();
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
                    {isEdit ? 'Editar Categoria' : 'Criar Nova Categoria'}
                </Typography>
                <TextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={category.description}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? 'Atualizar' : 'Salvar'}
                </Button>
            </Box>
        </Modal>
    );
};

export default CategoryForm;