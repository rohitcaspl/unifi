import * as signaturesLambdaApi from '@api/lambdaApi/signatures';
import { mapFormsToSignatures } from '@shared/helpers/mapFormNameToSignatures';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthContext } from 'context/AuthContext';
import { useWorkspaceContext } from 'context/WorkspaceContext';
import { useMemo, useEffect, useState } from 'react';

const gap = 10;

const fetchSignatures = async (data, nextPk, nextSk, limit) => {
  let signatures;

  if (data?.project_id) {
    if (data.form_id && data.form_id !== 0) {
      signatures = await signaturesLambdaApi.getAllFormSignatures(
        data.project_id,
        data.form_id,
        nextPk,
        nextSk,
        limit,
      );
    } else {
      signatures = await signaturesLambdaApi.getAllProjectSignatures(
        data.project_id,
        nextPk,
        nextSk,
        limit,
      );
    }
  }

  //if (data.agent_id && data.agent_id != 0) {
  //  signatures.signatures = signatures.signatures.filter(signature => signature.agent_id == data.agent_id);
  //}

  return {
    signatures,
  };
};

const useGetUserSignatures = (filterData, sort) => {
  const [flatData, setFlatResult] = useState([]);
  const { projects, selectedWorkspace } = useWorkspaceContext();
  const {
    userData: {
      data: {
        data: { _id: agent_id },
      },
    },
  } = useAuthContext();

  const project_id = filterData?.project?._id;
  const form_id = filterData?.form?._id;
  const company_id = selectedWorkspace?._id;
  const company_name = selectedWorkspace?.company_name;

  const queryData = {
    gap,
    company_id,
    company_name,
    agent_id,
    project_id,
    form_id,
    sort,
  };
  const queryKey = useMemo(
    () => [
      'signatures',
      sort,
      agent_id,
      gap,
      company_id,
      company_name,
      project_id || '',
      form_id || '',
    ],
    [sort, agent_id, company_id, company_name, project_id, form_id],
  );

  const queryResult = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = undefined }) =>
      fetchSignatures(queryData, pageParam?.pk, pageParam?.sk, gap),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.next;
    },
  });

  useEffect(() => {
    if (queryResult.error) {
      setFlatResult();
    }
  }, [queryResult.error]);

  useEffect(() => {
    if (queryResult.data) {
      setFlatResult(
        queryResult.data.pages
          ?.map(p => p?.signatures?.signatures || [])
          .flat(),
      );
    }
  }, [queryResult.data]);

  return useMemo(() => {
    return {
      ...queryResult,
      signatures: mapFormsToSignatures(projects?.data?.data || [], flatData),
      totalSignaturesCount: queryResult?.data?.pages[0]?.signatures?.total || 0,
    };
  }, [flatData, queryResult, projects]);
};

export default useGetUserSignatures;
