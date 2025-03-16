import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const ProductTable = ({ products, onRemoveProduct }) => {
    return (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Preço Unitário</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Ação</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={index}>
                            <TableCell>{product.name || 'N/A'}</TableCell>
                            <TableCell>{parseFloat(product.unitPrice).toFixed(2)}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{(parseFloat(product.unitPrice) * parseInt(product.quantity, 10)).toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton color="error" onClick={() => onRemoveProduct(index)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;