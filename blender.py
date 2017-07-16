import bpy
import math
from datetime import date
from github_contributions import GithubUser

YEAR = 2016

BAR_COLORS = [
    (0.933, 0.933, 0.933),
    (0.776, 0.894, 0.545),
    (0.482, 0.788, 0.435),
    (0.137, 0.604, 0.231),
    (0.098, 0.380, 0.153)
]

FONT_COLOR = (0.141, 0.161, 0.18)

BASE_COLOR = (1, 1, 1)

contributions = GithubUser('bcongdon').contributions(end_date='{}-12-31'.format(YEAR))
counts = [x.count for x in contributions.days]
levels = [x.level for x in contributions.days]


def delete_all():
    for ob in bpy.context.scene.objects:
        ob.select = True
    bpy.ops.object.delete()


def create_bar_materials():
    # Create materials for day bars
    return [create_material(c, str(idx)) for idx, c in enumerate(BAR_COLORS)]


def create_material(rgb, name):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgb
    return mat


def create_model_base(mat, num_weeks):
    # Create base
    width = num_weeks / 7.0
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
    bpy.context.object.scale = (width, 1, 0.5)
    bpy.ops.transform.translate(value=(- width, 0, 0.5))
    base_obj = bpy.context.object
    base_obj.data.materials.append(mat)


def create_user_label(mat):
    # Create text label
    bpy.ops.object.text_add(location=(0, 0, 0))
    text_ob = bpy.context.object
    text_ob.data.body = 'bcongdon / {}'.format(YEAR)
    text_ob.data.align_x = 'LEFT'
    text_ob.data.materials.append(mat)
    bpy.ops.transform.rotate(value=1.5708, axis=(1, 0, 0))
    bpy.ops.transform.rotate(value=3.14159, axis=(0, 0, 1))
    bpy.context.object.data.extrude = 0.075
    bpy.ops.transform.translate(value=(-2/7, 0.975, 0.25))
    bpy.ops.object.convert(target='MESH')


def coords_for_year_idx(idx):
    x0 = -1/7
    y0 = -6/7
    week = math.floor(idx / 7)
    day = idx % 7
    x = x0 - week * (2.0/7)
    y = y0 + day * (2.0/7)
    return x, y


def create_day_bars(mats):
    # Create a bar for each day
    max_count = max(counts)
    max_z = 0.75
    for idx, day in enumerate(contributions.days):
        if day.date < date(YEAR, 1, 1) or day.count == 0:
            continue
        x, y = coords_for_year_idx(idx)
        z = (float(day.count) / max_count) * max_z

        bpy.ops.mesh.primitive_cube_add(location=(x, y, z + 1))
        bpy.context.object.scale = (1.0/7, 1.0/7, z)
        day_obj = bpy.context.object
        day_obj.data.materials.append(mats[day.level])


def join_all_objects():
    # Join all objects into a mesh
    for ob in bpy.context.scene.objects:
        ob.select = True
    bpy.ops.object.join()


delete_all()
bar_mats = create_bar_materials()
font_mat = create_material(FONT_COLOR, 'font')
base_mat = create_material(BASE_COLOR, 'base')
num_weeks = math.ceil(len(contributions.days) / 7)
create_model_base(base_mat, num_weeks)
create_user_label(font_mat)
create_day_bars(bar_mats)
join_all_objects()
bpy.ops.wm.collada_export(filepath='output.dae')
bpy.ops.wm.quit_blender()
