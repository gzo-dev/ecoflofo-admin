import { Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Thay đổi màu nền tại đây nếu cần
    },
    content: {
        textAlign: 'center',
    },
    button: {
        marginTop: '8px', // Thay đổi khoảng cách trên dưới nút tại đây nếu cần
    },
};

const GuardPage = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: "100%", overflowX: "hidden"}}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Truy Cập Bị Từ Chối
                    </Typography>
                    <Typography variant="body1">
                        Xin lỗi, bạn không có quyền truy cập vào trang này.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/"
                        style={{ marginTop: '8px' }}
                    >
                        Quay Về Trang Chủ
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default GuardPage;
