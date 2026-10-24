export const projectSchema = {
  name: 'project',
  title: 'Project & Case Study',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'UI/UX Design', value: 'ui-ux' },
          { title: 'Web Projects', value: 'web' },
          { title: 'Graphic Design', value: 'graphic-design' },
        ],
      },
      initialValue: 'ui-ux',
    },
    {
      name: 'categoryLabel',
      title: 'Category Label (Display Text)',
      type: 'string',
      placeholder: 'e.g. UI/UX Design, Web / UI/UX',
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      initialValue: new Date().getFullYear(),
    },
    {
      name: 'role',
      title: 'Your Role',
      type: 'string',
      placeholder: 'e.g. UI/UX Designer & Front-End Contributor',
    },
    {
      name: 'projectType',
      title: 'Project Type / Context',
      type: 'string',
      placeholder: 'e.g. Government, Academic, Community Project (KKN-T)',
    },
    {
      name: 'summary',
      title: 'Summary / Short Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured on Home Showcase',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'published',
      title: 'Published (Visible on site)',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'tags',
      title: 'Tags / Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Year, Newest First',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'categoryLabel',
      media: 'coverImage',
    },
  },
};
