import os

os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "1"

import numpy as np
import matplotlib.pyplot as plt
import cv2
import open3d as o3d


def apply_colormap(disparity, colormap_name='plasma'):
    """
    Zamienia mapę głębi na kolorowy obraz używając palety matplotlib.
    Dostępne palety: 'plasma', 'jet', 'magma', 'viridis', 'inferno', 'turbo'
    """
    disp_normalized = disparity.copy()
    mask = disp_normalized > 0
    if mask.any():
        disp_normalized[mask] = (disp_normalized[mask] - disp_normalized[mask].min()) / \
                                (disp_normalized[mask].max() - disp_normalized[mask].min())

    cmap = plt.get_cmap(colormap_name)
    colored = (cmap(disp_normalized)[:, :, :3] * 255).astype(np.uint8)
    colored_bgr = cv2.cvtColor(colored, cv2.COLOR_RGB2BGR)
    return colored_bgr


def mkdirs(path):
    try:
        os.makedirs(path)
    except:
        pass


class Saver(object):

    def __init__(self, save_dir):
        self.idx = 0
        self.save_dir = os.path.join(save_dir, "results")
        if not os.path.exists(self.save_dir):
            mkdirs(self.save_dir)

    def save_as_point_cloud(self, depth, rgb, path, mask=None):
        h, w = depth.shape
        Theta = np.pi - np.arange(h).reshape(h, 1) * np.pi / h - np.pi / h / 2
        Theta = np.repeat(Theta, w, axis=1)
        Phi = np.arange(w).reshape(1, w) * 2 * np.pi / w + np.pi / w - np.pi
        Phi = np.repeat(Phi, h, axis=0)

        X = depth * np.sin(Theta) * np.sin(Phi)
        Y = depth * np.cos(Theta)
        Z = depth * np.sin(Theta) * np.cos(Phi)

        if mask is None:
            X = X.flatten()
            Y = Y.flatten()
            Z = Z.flatten()
            R = rgb[:, :, 0].flatten()
            G = rgb[:, :, 1].flatten()
            B = rgb[:, :, 2].flatten()
        else:
            X = X[mask]
            Y = Y[mask]
            Z = Z[mask]
            R = rgb[:, :, 0][mask]
            G = rgb[:, :, 1][mask]
            B = rgb[:, :, 2][mask]

        XYZ = np.stack([X, Y, Z], axis=1)
        RGB = np.stack([R, G, B], axis=1)

        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(XYZ)
        pcd.colors = o3d.utility.Vector3dVector(RGB)
        o3d.io.write_point_cloud(path, pcd)

    def save_pred_samples(self, rgb, pred_depth, name, model_name=''):
        """
        Saves samples
        """
        rgb = rgb.cpu().numpy().transpose(0, 2, 3, 1)[0]
        pred_depth = pred_depth.cpu().numpy()[0, 0]

        # ── MASKA: czarne piksele na oryginale = czarne na głębi ──
        # Piksel jest "czarny" jeśli wszystkie kanały RGB < 10
        black_mask = np.all(rgb < (10 / 255.0), axis=-1)

        # ── ZAPIS FLOAT (EXR) ──
        path_exr = os.path.join(self.save_dir[:-7], name + f'_depth_pred_{model_name}.exr')
        cv2.imwrite(path_exr, pred_depth)

        # ── ZAPIS FLOAT (NPY) ──
        path_npy = os.path.join(self.save_dir[:-7], name + f'_depth_pred_{model_name}.npy')
        np.save(path_npy, pred_depth)

        # ── MAPA GŁĘBI Z PALETĄ KOLORÓW + MASKA ──
        depth = pred_depth.copy()
        depth[depth <= 0] = 0
        disp = np.zeros_like(depth)
        disp[depth > 0] = 1.0 / depth[depth > 0]

        # Zastosuj paletę kolorów — zmień 'plasma' na inną jeśli chcesz
        # Opcje: 'plasma', 'jet', 'magma', 'viridis', 'inferno', 'turbo'
        colored = apply_colormap(disp, colormap_name='plasma')

        # Zastosuj maskę czarnych pikseli
        colored[black_mask] = [0, 0, 0]

        path_jpg = os.path.join(self.save_dir[:-7], name + f'_depth_pred_{model_name}.jpg')
        cv2.imwrite(path_jpg, colored)

        # ── ZAPIS PNG Z PRZEZROCZYSTOŚCIĄ (ALPHA) ──
        colored_rgba = cv2.cvtColor(colored, cv2.COLOR_BGR2BGRA)
        colored_rgba[black_mask, 3] = 0  # przezroczyste tam gdzie czarne
        path_png = os.path.join(self.save_dir[:-7], name + f'_depth_pred_{model_name}.png')
        cv2.imwrite(path_png, colored_rgba)

        # ── ZAPIS RGB ──
        rgb1 = (rgb * 255).astype(np.uint8)
        path_rgb = os.path.join(self.save_dir[:-7], name + '_rgb.jpg')
        cv2.imwrite(path_rgb, rgb1[:, :, ::-1])

        # ── CHMURA PUNKTÓW ──
        path_ply = os.path.join(self.save_dir[:-7], name + f'_pc_pred_{model_name}.ply')
        self.save_as_point_cloud(pred_depth, rgb, path_ply, pred_depth < 200)