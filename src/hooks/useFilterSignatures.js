import { DEFAULT_FORM_FILTER, SORT_TYPES } from '@shared/constants';
import { useWorkspaceContext } from 'context/WorkspaceContext';
import { useEffect, useState } from 'react';

const useFilterSignatures = () => {
  const { projects } = useWorkspaceContext();

  const [form, setForm] = useState(DEFAULT_FORM_FILTER);
  const [project, setProject] = useState(null);
  const [sort, setSort] = useState(SORT_TYPES.RECENT);

  const [projectsFilters, setProjectsFilters] = useState([]);
  const [formsFilters, setFormsFilters] = useState([DEFAULT_FORM_FILTER]);

  useEffect(() => {
    const projectsList = projects?.data?.data || [];

    let project_id = project?._id;
    if (!project_id && projectsList.length > 0) {
      setProject(projectsList[0]);
      project_id = projectsList[0]._id;
    }

    const formsList = projectsList
      .map(p => (p._id === project_id ? p.forms : []))
      .flat();

    setFormsFilters([DEFAULT_FORM_FILTER, ...formsList]);
    setProjectsFilters(projectsList);
  }, [projects, project]);

  const setProjectFilter = proj => {
    setForm(DEFAULT_FORM_FILTER);
    setProject(proj);
  };

  return {
    sort,
    formsFilters,
    projectsFilters,
    filterData: { form, project },
    setFormFilter: setForm,
    setProjectFilter,
    setSort,
  };
};

export default useFilterSignatures;
